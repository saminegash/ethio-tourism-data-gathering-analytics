import { ulid } from 'ulid';
import Ajv from 'ajv';
// import addFormats from 'ajv-formats';
import {
  TelemetryEvent,
  TelemetryConfig,
  ValidationResult,
  BatchEventRequest,
  BatchEventResponse,
  TouristCheckinEvent,
  WristbandLinkedEvent,
  PurchaseCompletedEvent,
  POIInteractionEvent,
  RecommendationShownEvent,
} from './types';

// Import JSON schemas
import touristCheckinSchema from '../../proto/events/tourist-checkin.json';
import wristbandLinkedSchema from '../../proto/events/wristband-linked.json';
import purchaseCompletedSchema from '../../proto/events/purchase-completed.json';
import poiInteractionSchema from '../../proto/events/poi-interaction.json';
import recommendationShownSchema from '../../proto/events/recommendation-shown.json';

export class TelemetrySDK {
  private endpoint: string;
  private apiKey: string;
  private batchSize: number;
  private flushInterval: number;
  private retryAttempts: number;
  private retryDelay: number;
  private enableValidation: boolean;
  private enableCompression: boolean;
  
  private eventQueue: TelemetryEvent[] = [];
  private flushTimer?: NodeJS.Timeout;
  private ajv: Ajv;
  private schemas: Map<string, any> = new Map();

  constructor(config: TelemetryConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.batchSize = config.batchSize || 100;
    this.flushInterval = config.flushInterval || 5000; // 5 seconds
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000; // 1 second
    this.enableValidation = config.enableValidation !== false; // default true
    this.enableCompression = config.enableCompression || false;

    // Initialize AJV for schema validation
    this.ajv = new Ajv({ allErrors: true });
    // addFormats(this.ajv);
    
    // Load schemas
    this.loadSchemas();
    
    // Start flush timer
    this.startFlushTimer();
  }

  private loadSchemas(): void {
    this.schemas.set('tourist.check_in', this.ajv.compile(touristCheckinSchema));
    this.schemas.set('wristband.linked', this.ajv.compile(wristbandLinkedSchema));
    this.schemas.set('purchase.completed', this.ajv.compile(purchaseCompletedSchema));
    this.schemas.set('poi.interaction', this.ajv.compile(poiInteractionSchema));
    this.schemas.set('recommendation.shown', this.ajv.compile(recommendationShownSchema));
  }

  /**
   * Track a telemetry event
   */
  async track(event: TelemetryEvent): Promise<void> {
    // Validate event if validation is enabled
    if (this.enableValidation) {
      const validation = this.validateEvent(event);
      if (!validation.valid) {
        throw new Error(`Invalid event schema for topic ${event.topic}: ${validation.errors?.join(', ')}`);
      }
    }

    // Ensure event has required fields
    if (!event.event_id) {
      event.event_id = ulid();
    }
    if (!event.occurred_at) {
      event.occurred_at = new Date().toISOString();
    }

    // Add to queue
    this.eventQueue.push(event);

    // Flush if batch size reached
    if (this.eventQueue.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Validate an event against its schema
   */
  private validateEvent(event: TelemetryEvent): ValidationResult {
    const validator = this.schemas.get(event.topic);
    if (!validator) {
      return {
        valid: false,
        errors: [`Unknown event topic: ${event.topic}`],
      };
    }

    const valid = validator(event);
    if (valid) {
      return { valid: true };
    }

    return {
      valid: false,
      errors: validator.errors?.map((err: any) => `${err.instancePath}: ${err.message}`) || ['Unknown validation error'],
    };
  }

  /**
   * Flush all queued events to the server
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    const batchRequest: BatchEventRequest = {
      events,
      batch_id: ulid(),
      timestamp: new Date().toISOString(),
    };

    try {
      await this.sendBatch(batchRequest);
    } catch (error) {
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
      throw error;
    }
  }

  /**
   * Send a batch of events to the server with retry logic
   */
  private async sendBatch(batchRequest: BatchEventRequest, attempt: number = 1): Promise<BatchEventResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Batch-ID': batchRequest.batch_id || ulid(),
      };

      if (this.enableCompression) {
        headers['Content-Encoding'] = 'gzip';
      }

      const response = await fetch(`${this.endpoint}/events/batch`, {
        method: 'POST',
        headers,
        body: JSON.stringify(batchRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: BatchEventResponse = await response.json();
      return result;
    } catch (error) {
      if (attempt < this.retryAttempts) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.sendBatch(batchRequest, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Start the automatic flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush().catch(console.error);
    }, this.flushInterval);
  }

  /**
   * Stop the flush timer and flush remaining events
   */
  async destroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
    await this.flush();
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.eventQueue.length;
  }

  /**
   * Clear the event queue (useful for testing)
   */
  clearQueue(): void {
    this.eventQueue = [];
  }
}

// Helper functions for common events
export const createTouristCheckinEvent = (data: {
  touristId: string;
  destinationId?: string;
  registrationMethod: 'passport_scan' | 'manual_entry' | 'immigration_api' | 'fayda_api' | 'qr_code';
  groupSize: number;
  consents?: { marketing?: boolean; location?: boolean; analytics?: boolean };
  context: {
    app: string;
    device: string;
    session_id?: string;
    operator_id?: string;
  };
}): TouristCheckinEvent => ({
  event_id: ulid(),
  topic: 'tourist.check_in',
  version: '1.0',
  occurred_at: new Date().toISOString(),
  actor_id: hashTouristId(data.touristId),
  context: data.context,
  geo: data.destinationId ? { destination_id: data.destinationId } : undefined,
  payload: {
    registration_method: data.registrationMethod,
    group_size: data.groupSize,
    consent_marketing: data.consents?.marketing,
    consent_location: data.consents?.location,
    consent_analytics: data.consents?.analytics,
  },
});

export const createWristbandLinkedEvent = (data: {
  touristId: string;
  wristbandId: string;
  wristbandUid: string;
  walletBalance: number;
  spendingLimits: { daily: number; offline: number };
  context: {
    app: string;
    device: string;
    operator_id?: string;
    location?: string;
  };
}): WristbandLinkedEvent => ({
  event_id: ulid(),
  topic: 'wristband.linked',
  version: '1.0',
  occurred_at: new Date().toISOString(),
  actor_id: hashTouristId(data.touristId),
  context: data.context,
  payload: {
    wristband_id: data.wristbandId,
    wristband_uid_hash: hashWristbandUid(data.wristbandUid),
    wallet_balance: data.walletBalance,
    currency: 'ETB',
    spending_limits: data.spendingLimits,
  },
});

export const createPurchaseCompletedEvent = (data: {
  touristId: string;
  transactionId: string;
  amount: number;
  paymentMethod: 'wristband_nfc' | 'mobile_money' | 'card' | 'cash' | 'qr_code';
  merchantId: string;
  merchantCategory: string;
  context: {
    device: string;
    merchant_id: string;
    location?: string;
    operator_id?: string;
  };
}): PurchaseCompletedEvent => ({
  event_id: ulid(),
  topic: 'purchase.completed',
  version: '1.0',
  occurred_at: new Date().toISOString(),
  actor_id: hashTouristId(data.touristId),
  context: data.context,
  payload: {
    transaction_id: data.transactionId,
    amount: data.amount,
    currency: 'ETB',
    payment_method: data.paymentMethod,
    merchant_category: data.merchantCategory,
  },
});

export const createPOIInteractionEvent = (data: {
  touristId: string;
  interactionType: 'entry_scan' | 'exit_scan' | 'beacon_proximity' | 'qr_scan' | 'photo_taken' | 'audio_guide' | 'info_request';
  poiId: string;
  poiCategory: string;
  context: {
    device: string;
    location: string;
    session_id?: string;
  };
  metadata?: {
    dwellTimeMinutes?: number;
    queueTimeMinutes?: number;
    crowdLevel?: 'low' | 'moderate' | 'high' | 'very_high';
    groupSize?: number;
  };
}): POIInteractionEvent => ({
  event_id: ulid(),
  topic: 'poi.interaction',
  version: '1.0',
  occurred_at: new Date().toISOString(),
  actor_id: hashTouristId(data.touristId),
  context: data.context,
  payload: {
    interaction_type: data.interactionType,
    poi_id: data.poiId,
    poi_category: data.poiCategory,
    ...data.metadata,
  },
});

export const createRecommendationShownEvent = (data: {
  touristId: string;
  recommendationId: string;
  recommendationType: 'poi' | 'restaurant' | 'accommodation' | 'activity' | 'route' | 'event' | 'product';
  algorithmUsed: 'content_based' | 'collaborative_filtering' | 'hybrid' | 'popularity' | 'trending' | 'manual';
  recommendedItem: {
    item_id: string;
    item_name: string;
    item_category: string;
  };
  context: {
    app: string;
    device: string;
    session_id?: string;
    page_url?: string;
    location?: string;
  };
}): RecommendationShownEvent => ({
  event_id: ulid(),
  topic: 'recommendation.shown',
  version: '1.0',
  occurred_at: new Date().toISOString(),
  actor_id: hashTouristId(data.touristId),
  context: data.context,
  payload: {
    recommendation_id: data.recommendationId,
    recommendation_type: data.recommendationType,
    algorithm_used: data.algorithmUsed,
    recommended_item: data.recommendedItem,
  },
});

// Utility functions for hashing (implement proper hashing in production)
function hashTouristId(touristId: string): string {
  // In production, use proper cryptographic hashing with salt
  return `tourist_${Buffer.from(touristId).toString('base64').substring(0, 16)}`;
}

function hashWristbandUid(uid: string): string {
  // In production, use proper cryptographic hashing with salt
  return `wristband_${Buffer.from(uid).toString('base64').substring(0, 16)}`;
}

// Export types
export * from './types';

// Default export
export default TelemetrySDK;
