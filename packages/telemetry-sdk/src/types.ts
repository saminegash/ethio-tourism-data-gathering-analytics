// Base event interface
export interface TelemetryEvent {
  event_id: string;
  topic: string;
  version: string;
  occurred_at: string;
  actor_id: string;
  context: EventContext;
  payload: Record<string, any>;
  pii_map?: Record<string, string>;
}

export interface EventContext {
  app: string;
  device: string;
  session_id?: string;
  user_agent?: string;
  location?: string;
  operator_id?: string;
}

// Specific event types
export interface TouristCheckinEvent extends TelemetryEvent {
  topic: 'tourist.check_in';
  payload: {
    registration_method: 'passport_scan' | 'manual_entry' | 'immigration_api' | 'fayda_api' | 'qr_code';
    group_size: number;
    intended_duration_days?: number;
    purpose_of_visit?: 'leisure' | 'business' | 'cultural' | 'adventure' | 'religious' | 'other';
    nationality?: string;
    age_group?: 'child' | 'teen' | 'adult' | 'senior';
    consent_marketing?: boolean;
    consent_location?: boolean;
    consent_analytics?: boolean;
    preferred_language?: 'en' | 'am' | 'or' | 'ti';
    special_requirements?: string[];
  };
}

export interface WristbandLinkedEvent extends TelemetryEvent {
  topic: 'wristband.linked';
  payload: {
    wristband_id: string;
    wristband_uid_hash: string;
    wallet_balance: number;
    currency: 'ETB' | 'USD';
    spending_limits: {
      daily: number;
      offline: number;
      transaction?: number;
    };
    permissions?: string[];
    hardware_info?: {
      version?: string;
      manufacturer?: string;
      battery_level?: number;
    };
  };
}

export interface PurchaseCompletedEvent extends TelemetryEvent {
  topic: 'purchase.completed';
  payload: {
    transaction_id: string;
    external_transaction_id?: string;
    amount: number;
    currency: 'ETB' | 'USD';
    payment_method: 'wristband_nfc' | 'mobile_money' | 'card' | 'cash' | 'qr_code';
    payment_provider?: string;
    merchant_category: string;
    items?: Array<{
      category: string;
      subcategory?: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      item_name?: string;
    }>;
    discounts?: Array<{
      type: string;
      amount: number;
      code?: string;
    }>;
    taxes?: {
      vat_rate?: number;
      vat_amount?: number;
      service_charge?: number;
    };
    is_offline?: boolean;
    processing_time_ms?: number;
  };
}

export interface POIInteractionEvent extends TelemetryEvent {
  topic: 'poi.interaction';
  payload: {
    interaction_type: 'entry_scan' | 'exit_scan' | 'beacon_proximity' | 'qr_scan' | 'photo_taken' | 'audio_guide' | 'info_request';
    poi_id: string;
    poi_name?: string;
    poi_category: string;
    dwell_time_minutes?: number;
    queue_time_minutes?: number;
    crowd_level?: 'low' | 'moderate' | 'high' | 'very_high';
    weather_condition?: string;
    temperature_celsius?: number;
    group_size?: number;
    has_guide?: boolean;
    guide_language?: string;
    accessibility_used?: string[];
    satisfaction_rating?: number;
    interaction_metadata?: Record<string, any>;
  };
}

export interface RecommendationShownEvent extends TelemetryEvent {
  topic: 'recommendation.shown';
  payload: {
    recommendation_id: string;
    recommendation_type: 'poi' | 'restaurant' | 'accommodation' | 'activity' | 'route' | 'event' | 'product';
    algorithm_used: 'content_based' | 'collaborative_filtering' | 'hybrid' | 'popularity' | 'trending' | 'manual';
    model_version?: string;
    confidence_score?: number;
    relevance_score?: number;
    recommended_item: {
      item_id: string;
      item_name: string;
      item_category: string;
      item_subcategory?: string;
      price_range?: 'free' | 'low' | 'medium' | 'high' | 'premium';
      distance_km?: number;
      estimated_duration_minutes?: number;
      rating?: number;
    };
    context_features?: Record<string, any>;
    personalization_factors?: Record<string, any>;
    display_position?: number;
    total_recommendations?: number;
    ab_test_variant?: string;
  };
}

// SDK Configuration
export interface TelemetryConfig {
  endpoint: string;
  apiKey: string;
  batchSize?: number;
  flushInterval?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableValidation?: boolean;
  enableCompression?: boolean;
}

// Event validation result
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

// Batch request/response types
export interface BatchEventRequest {
  events: TelemetryEvent[];
  batch_id?: string;
  timestamp?: string;
}

export interface BatchEventResponse {
  success: boolean;
  processed_count: number;
  failed_count: number;
  errors?: Array<{
    event_id: string;
    error: string;
  }>;
  batch_id: string;
}
