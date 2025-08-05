#!/bin/bash

# Performance Testing Script for Travel Platform
# This script performs comprehensive performance tests on the travel platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost"
API_BASE_URL="${BASE_URL}/api/v1"
GATEWAY_URL="${BASE_URL}:8080"
USER_SERVICE_URL="${BASE_URL}:8081"
TRAVEL_SERVICE_URL="${BASE_URL}:8082"

# Test parameters
CONCURRENT_USERS=100
DURATION=60
RAMP_UP_TIME=10

echo -e "${BLUE}🚀 Travel Platform Performance Testing${NC}"
echo "=========================================="

# Function to check if service is running
check_service() {
    local service_name=$1
    local service_url=$2
    local max_retries=30
    local retry_count=0
    
    echo -e "${YELLOW}Checking ${service_name}...${NC}"
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -s -f "${service_url}/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ ${service_name} is running${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Waiting for ${service_name}... (${retry_count}/${max_retries})${NC}"
        sleep 2
        retry_count=$((retry_count + 1))
    done
    
    echo -e "${RED}❌ ${service_name} is not responding${NC}"
    return 1
}

# Function to run load test
run_load_test() {
    local test_name=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo -e "${BLUE}Running load test: ${test_name}${NC}"
    echo "Endpoint: ${endpoint}"
    echo "Method: ${method}"
    echo "Concurrent users: ${CONCURRENT_USERS}"
    echo "Duration: ${DURATION}s"
    echo "Ramp-up time: ${RAMP_UP_TIME}s"
    
    # Create test data file if POST/PUT request
    local data_file=""
    if [ -n "$data" ]; then
        data_file=$(mktemp)
        echo "$data" > "$data_file"
    fi
    
    # Run Apache Bench test
    local ab_cmd="ab -n $((CONCURRENT_USERS * DURATION)) -c ${CONCURRENT_USERS} -t ${DURATION} -r -k"
    
    if [ "$method" = "POST" ] || [ "$method" = "PUT" ]; then
        ab_cmd="$ab_cmd -p $data_file -T application/json"
    fi
    
    ab_cmd="$ab_cmd ${endpoint}"
    
    echo "Command: $ab_cmd"
    echo "----------------------------------------"
    
    # Run the test and capture results
    local output_file=$(mktemp)
    eval "$ab_cmd" > "$output_file" 2>&1
    
    # Parse and display results
    echo -e "${GREEN}Results for ${test_name}:${NC}"
    echo "----------------------------------------"
    
    # Extract key metrics
    local requests_per_second=$(grep "Requests per second" "$output_file" | awk '{print $4}')
    local time_per_request=$(grep "Time per request" "$output_file" | head -1 | awk '{print $4}')
    local failed_requests=$(grep "Failed requests" "$output_file" | awk '{print $3}')
    local total_requests=$(grep "Complete requests" "$output_file" | awk '{print $3}')
    
    echo "Requests per second: ${requests_per_second}"
    echo "Time per request (ms): ${time_per_request}"
    echo "Failed requests: ${failed_requests}"
    echo "Total requests: ${total_requests}"
    
    # Calculate success rate
    if [ -n "$total_requests" ] && [ "$total_requests" -gt 0 ]; then
        local success_rate=$(( (total_requests - failed_requests) * 100 / total_requests ))
        echo "Success rate: ${success_rate}%"
    fi
    
    # Cleanup
    rm -f "$output_file" "$data_file"
    echo ""
}

# Function to run stress test
run_stress_test() {
    local test_name=$1
    local endpoint=$2
    local max_concurrent=500
    
    echo -e "${BLUE}Running stress test: ${test_name}${NC}"
    echo "Endpoint: ${endpoint}"
    echo "Max concurrent users: ${max_concurrent}"
    echo "Duration: ${DURATION}s"
    
    # Run wrk stress test
    local wrk_cmd="wrk -t12 -c${max_concurrent} -d${DURATION}s --latency ${endpoint}"
    
    echo "Command: $wrk_cmd"
    echo "----------------------------------------"
    
    eval "$wrk_cmd"
    echo ""
}

# Function to test database performance
test_database_performance() {
    echo -e "${BLUE}Testing database performance...${NC}"
    
    # Test database connection
    if command -v psql >/dev/null 2>&1; then
        echo -e "${YELLOW}Testing PostgreSQL connection...${NC}"
        
        # Test connection
        if PGPASSWORD=password psql -h localhost -U postgres -d travel_platform_users -c "SELECT 1;" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ PostgreSQL connection successful${NC}"
            
            # Test query performance
            echo -e "${YELLOW}Testing query performance...${NC}"
            PGPASSWORD=password psql -h localhost -U postgres -d travel_platform_users -c "
                \timing on
                SELECT COUNT(*) FROM users;
                SELECT COUNT(*) FROM travel_packages;
                \timing off
            "
        else
            echo -e "${RED}❌ PostgreSQL connection failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  psql not available, skipping database tests${NC}"
    fi
}

# Function to test cache performance
test_cache_performance() {
    echo -e "${BLUE}Testing cache performance...${NC}"
    
    # Test Redis connection
    if command -v redis-cli >/dev/null 2>&1; then
        echo -e "${YELLOW}Testing Redis connection...${NC}"
        
        if redis-cli -h localhost ping > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Redis connection successful${NC}"
            
            # Test Redis performance
            echo -e "${YELLOW}Testing Redis performance...${NC}"
            redis-cli -h localhost --eval - << 'EOF'
                local start = redis.call('TIME')[1]
                for i = 1, 1000 do
                    redis.call('SET', 'test:' .. i, 'value:' .. i)
                end
                local end_time = redis.call('TIME')[1]
                print('Set 1000 keys in ' .. (end_time - start) .. ' seconds')
                
                start = redis.call('TIME')[1]
                for i = 1, 1000 do
                    redis.call('GET', 'test:' .. i)
                end
                end_time = redis.call('TIME')[1]
                print('Get 1000 keys in ' .. (end_time - start) .. ' seconds')
                
                -- Cleanup
                for i = 1, 1000 do
                    redis.call('DEL', 'test:' .. i)
                end
EOF
        else
            echo -e "${RED}❌ Redis connection failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  redis-cli not available, skipping cache tests${NC}"
    fi
}

# Function to generate test data
generate_test_data() {
    echo -e "${BLUE}Generating test data...${NC}"
    
    # Create test user registration data
    cat > test_user_data.json << 'EOF'
{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890"
}
EOF
    
    # Create test travel package data
    cat > test_travel_data.json << 'EOF'
{
    "title": "Test Travel Package",
    "description": "A test travel package for performance testing",
    "destination": "Test Destination",
    "price": 999.99,
    "durationDays": 7,
    "maxTravelers": 4
}
EOF
    
    echo -e "${GREEN}✅ Test data generated${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting performance tests...${NC}"
    echo ""
    
    # Check if required tools are available
    if ! command -v ab >/dev/null 2>&1; then
        echo -e "${RED}❌ Apache Bench (ab) is not installed${NC}"
        echo "Please install it: sudo apt-get install apache2-utils"
        exit 1
    fi
    
    if ! command -v wrk >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  wrk is not installed, stress tests will be skipped${NC}"
        echo "Install wrk: https://github.com/wg/wrk"
    fi
    
    # Check services
    echo -e "${BLUE}Checking services...${NC}"
    check_service "API Gateway" "${GATEWAY_URL}/health" || exit 1
    check_service "User Service" "${USER_SERVICE_URL}/health" || exit 1
    check_service "Travel Service" "${TRAVEL_SERVICE_URL}/health" || exit 1
    
    echo ""
    
    # Generate test data
    generate_test_data
    
    echo ""
    echo -e "${BLUE}Starting performance tests...${NC}"
    echo "=========================================="
    
    # Load tests
    echo -e "${BLUE}1. Load Tests${NC}"
    echo "================"
    
    # Health check load test
    run_load_test "Health Check" "${GATEWAY_URL}/health"
    
    # User service load tests
    run_load_test "User Health Check" "${USER_SERVICE_URL}/health"
    run_load_test "User Registration" "${API_BASE_URL}/users/register" "POST" "$(cat test_user_data.json)"
    
    # Travel service load tests
    run_load_test "Travel Health Check" "${TRAVEL_SERVICE_URL}/health"
    run_load_test "Travel Packages" "${API_BASE_URL}/travels/packages"
    
    # Stress tests (if wrk is available)
    if command -v wrk >/dev/null 2>&1; then
        echo -e "${BLUE}2. Stress Tests${NC}"
        echo "================"
        
        run_stress_test "API Gateway Stress" "${GATEWAY_URL}/health"
        run_stress_test "User Service Stress" "${USER_SERVICE_URL}/health"
        run_stress_test "Travel Service Stress" "${TRAVEL_SERVICE_URL}/health"
    fi
    
    # Infrastructure tests
    echo -e "${BLUE}3. Infrastructure Tests${NC}"
    echo "========================"
    
    test_database_performance
    echo ""
    test_cache_performance
    
    # Cleanup
    rm -f test_user_data.json test_travel_data.json
    
    echo ""
    echo -e "${GREEN}✅ Performance testing completed!${NC}"
    echo ""
    echo -e "${BLUE}📊 Performance Summary:${NC}"
    echo "================================"
    echo "• Load tests completed"
    if command -v wrk >/dev/null 2>&1; then
        echo "• Stress tests completed"
    fi
    echo "• Database performance tested"
    echo "• Cache performance tested"
    echo ""
    echo -e "${YELLOW}💡 Tips for improving performance:${NC}"
    echo "• Monitor cache hit rates"
    echo "• Optimize database queries"
    echo "• Use connection pooling"
    echo "• Implement proper indexing"
    echo "• Consider horizontal scaling"
}

# Run main function
main "$@" 