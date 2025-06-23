#!/bin/bash

echo "🔧 Supabase Environment Setup Helper"
echo "===================================="
echo ""

# Function to validate URL format
validate_url() {
    if [[ $1 =~ ^https://[a-zA-Z0-9-]+\.supabase\.co$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate anon key
validate_anon_key() {
    # Anon keys are typically 150-250 characters and start with eyJ
    if [[ ${#1} -gt 100 && ${#1} -lt 300 && $1 =~ ^eyJ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate service role key
validate_service_key() {
    # Service role keys are typically 400+ characters and start with eyJ
    if [[ ${#1} -gt 300 && $1 =~ ^eyJ ]]; then
        return 0
    else
        return 1
    fi
}

echo "📋 Step 1: Get your Supabase credentials"
echo "   1. Go to https://supabase.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to Settings → API"
echo "   4. You need BOTH keys for this project:"
echo "      • Anon Key: For frontend/user operations (shorter, ~200 chars)"
echo "      • Service Role Key: For analytics/backend operations (longer, ~400+ chars)"
echo ""

# Get URL
while true; do
    read -p "Enter your Supabase Project URL: " SUPABASE_URL
    if validate_url "$SUPABASE_URL"; then
        echo "✅ Valid URL format"
        break
    else
        echo "❌ Invalid URL. Should be: https://your-project-id.supabase.co"
    fi
done

echo ""

# Get Anon Key
echo "📱 Anon Key (for frontend/dashboard operations):"
while true; do
    read -p "Enter your Anon Key: " SUPABASE_ANON_KEY
    if validate_anon_key "$SUPABASE_ANON_KEY"; then
        echo "✅ Valid anon key (${#SUPABASE_ANON_KEY} characters)"
        break
    else
        echo "❌ This doesn't look like an anon key (${#SUPABASE_ANON_KEY} characters)"
        echo "   Anon keys are typically 150-250 characters long."
        read -p "Continue anyway? (y/n): " confirm
        if [[ $confirm == "y" || $confirm == "Y" ]]; then
            break
        fi
    fi
done

echo ""

# Get Service Role Key
echo "🔧 Service Role Key (for analytics/backend operations):"
while true; do
    read -p "Enter your Service Role Key: " SUPABASE_SERVICE_KEY
    if validate_service_key "$SUPABASE_SERVICE_KEY"; then
        echo "✅ Valid service role key (${#SUPABASE_SERVICE_KEY} characters)"
        break
    else
        echo "❌ This looks too short for a service role key (${#SUPABASE_SERVICE_KEY} characters)"
        echo "   Service role keys are typically 400+ characters long."
        echo "   Make sure you're using the SERVICE ROLE key, not the anon key!"
        read -p "Continue anyway? (y/n): " confirm
        if [[ $confirm == "y" || $confirm == "Y" ]]; then
            break
        fi
    fi
done

echo ""
echo "🔄 Setting up environment variables..."

# Export for current session
export SUPABASE_URL="$SUPABASE_URL"
export SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
export SUPABASE_SERVICE_KEY="$SUPABASE_SERVICE_KEY"

# For backward compatibility, set SUPABASE_KEY to service key
export SUPABASE_KEY="$SUPABASE_SERVICE_KEY"

echo "✅ Environment variables set for current session"
echo ""

# Save to a file for easy re-use
cat > .env << EOF
# Supabase Configuration
export SUPABASE_URL='$SUPABASE_URL'
export SUPABASE_ANON_KEY='$SUPABASE_ANON_KEY'
export SUPABASE_SERVICE_KEY='$SUPABASE_SERVICE_KEY'

# For backward compatibility
export SUPABASE_KEY='$SUPABASE_SERVICE_KEY'
EOF

echo "💾 Saved to .env file for future use"
echo "   To load in future sessions: source .env"
echo ""

# Test the connection
echo "🔍 Testing connection..."
python3 debug_supabase_setup.py

echo ""
echo "📝 To make these permanent, add to your shell config:"
echo "   echo \"export SUPABASE_URL='$SUPABASE_URL'\" >> ~/.bashrc"
echo "   echo \"export SUPABASE_ANON_KEY='$SUPABASE_ANON_KEY'\" >> ~/.bashrc"
echo "   echo \"export SUPABASE_SERVICE_KEY='$SUPABASE_SERVICE_KEY'\" >> ~/.bashrc"
echo "   source ~/.bashrc"
echo ""
echo "🎯 Key Usage:"
echo "   • Anon Key: Frontend dashboard, user authentication"
echo "   • Service Role Key: Analytics engine, bypassing RLS policies" 