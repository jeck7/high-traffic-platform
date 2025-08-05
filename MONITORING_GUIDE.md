# 📊 Monitoring Guide - Prometheus + Grafana

## 🚀 Quick Start

### 1. Access Monitoring Tools
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

### 2. Grafana Setup
1. Login with `admin/admin`
2. Set new password: `admin123`
3. Add Prometheus data source:
   - URL: `http://prometheus:9090`
   - Access: Server (default)

## 📈 Key Metrics to Monitor

### 🔧 Application Metrics

#### HTTP Performance
```promql
# Requests per second
rate(http_server_requests_seconds_count[5m])

# Response time (95th percentile)
histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))

# Error rate
rate(http_server_requests_seconds_count{status=~"5.."}[5m])
```

#### JVM Metrics
```promql
# Memory usage
jvm_memory_used_bytes

# GC time
jvm_gc_collection_seconds_sum

# Thread count
jvm_threads_live_threads
```

#### Database Metrics
```promql
# Connection pool
hikaricp_connections_active
hikaricp_connections_idle

# Query performance
hikaricp_connections_usage
```

### 💼 Business Metrics

#### User Activity
```promql
# User registrations
increase(user_registrations_total[24h])

# Active users
active_users_total

# User sessions
rate(user_sessions_total[5m])
```

#### Booking Metrics
```promql
# Bookings per day
increase(travel_bookings_total[24h])

# Conversion rate
rate(travel_bookings_total[5m]) / rate(api_requests_total[5m]) * 100

# Popular destinations
topk(5, sum by (destination) (travel_bookings_total))
```

#### Revenue Metrics
```promql
# Daily revenue
increase(revenue_total[24h])

# Average booking value
increase(revenue_total[24h]) / increase(travel_bookings_total[24h])
```

## 📊 Dashboard Setup

### 1. Import Dashboards

#### Application Metrics Dashboard
1. Go to **Dashboards** → **Import**
2. Upload `infrastructure/grafana/dashboards/application-metrics.json`
3. Select Prometheus data source
4. **Import**

#### Business Metrics Dashboard
1. Go to **Dashboards** → **Import**
2. Upload `infrastructure/grafana/dashboards/business-metrics.json`
3. Select Prometheus data source
4. **Import**

### 2. Create Custom Dashboards

#### Step 1: Create New Dashboard
1. **+** → **Dashboard**
2. **Add new panel**

#### Step 2: Add Metrics
1. **Query** tab
2. Select **Prometheus** data source
3. Enter PromQL query
4. **Run Query**

#### Step 3: Configure Visualization
1. **Visualization** tab
2. Choose chart type (Graph, Stat, Table, etc.)
3. Configure colors, thresholds, etc.

## 🔍 Prometheus Queries

### Service Health
```promql
# All services status
up

# Specific service
up{job="user-service"}

# Service response time
rate(http_server_requests_seconds_sum[5m]) / rate(http_server_requests_requests_total[5m])
```

### Error Monitoring
```promql
# 5xx errors
rate(http_server_requests_seconds_count{status=~"5.."}[5m])

# 4xx errors
rate(http_server_requests_seconds_count{status=~"4.."}[5m])

# Error percentage
rate(http_server_requests_seconds_count{status=~"[45].."}[5m]) / rate(http_server_requests_seconds_count[5m]) * 100
```

### Performance Metrics
```promql
# CPU usage
rate(process_cpu_seconds_total[5m]) * 100

# Memory usage
process_resident_memory_bytes / 1024 / 1024

# Disk I/O
rate(process_open_fds[5m])
```

## 🚨 Alerting Setup

### 1. Create Alert Rules

#### High Error Rate
```yaml
groups:
  - name: application_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"
```

#### Service Down
```yaml
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
```

#### High Response Time
```yaml
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
```

### 2. Configure Alertmanager
1. Edit `infrastructure/prometheus/alertmanager.yml`
2. Add email/Slack notifications
3. Restart Prometheus

## 📊 Useful Grafana Panels

### 1. Service Overview
- **Type**: Stat
- **Query**: `up`
- **Thresholds**: 0 = red, 1 = green

### 2. Request Rate
- **Type**: Graph
- **Query**: `rate(http_server_requests_seconds_count[5m])`
- **Legend**: `{{job}} - {{method}} {{uri}}`

### 3. Response Time
- **Type**: Graph
- **Query**: `histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))`
- **Y-axis**: seconds

### 4. Error Rate
- **Type**: Graph
- **Query**: `rate(http_server_requests_seconds_count{status=~"5.."}[5m])`
- **Thresholds**: > 0.1 = red

### 5. Memory Usage
- **Type**: Graph
- **Query**: `jvm_memory_used_bytes`
- **Legend**: `{{job}} - {{area}}`

## 🔧 Advanced Configuration

### 1. Custom Metrics
Add custom metrics to your Spring Boot applications:

```java
@Component
public class BookingMetrics {
    private final Counter bookingCounter;
    private final Gauge activeUsersGauge;
    
    public BookingMetrics(MeterRegistry meterRegistry) {
        this.bookingCounter = Counter.builder("travel_bookings_total")
            .description("Total number of bookings")
            .register(meterRegistry);
            
        this.activeUsersGauge = Gauge.builder("active_users_total")
            .description("Number of active users")
            .register(meterRegistry, this, BookingMetrics::getActiveUsers);
    }
    
    public void recordBooking() {
        bookingCounter.increment();
    }
    
    private double getActiveUsers() {
        // Implementation to get active users count
        return activeUsersService.getActiveUsersCount();
    }
}
```

### 2. Recording Rules
Create `infrastructure/prometheus/recording_rules.yml`:

```yaml
groups:
  - name: recording_rules
    rules:
      - record: job:http_requests:rate5m
        expr: rate(http_server_requests_seconds_count[5m])
      
      - record: job:http_request_duration_seconds:p95
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))
      
      - record: job:error_rate:rate5m
        expr: rate(http_server_requests_seconds_count{status=~"[45].."}[5m])
```

## 📈 Performance Optimization

### 1. Prometheus Configuration
- **Scrape interval**: 10-15s for application metrics
- **Retention**: 15-30 days for production
- **Storage**: SSD recommended

### 2. Grafana Configuration
- **Refresh rate**: 10-30s for real-time dashboards
- **Time range**: 1h-24h for operational dashboards
- **Caching**: Enable query caching

### 3. Alert Optimization
- **Grouping**: Group related alerts
- **Throttling**: Prevent alert spam
- **Escalation**: Route critical alerts to on-call

## 🛠️ Troubleshooting

### Common Issues

#### 1. No Data in Grafana
- Check Prometheus targets: http://localhost:9090/targets
- Verify data source URL in Grafana
- Check service endpoints: `/actuator/prometheus`

#### 2. High Memory Usage
- Reduce scrape interval
- Add metric relabeling rules
- Use recording rules for complex queries

#### 3. Slow Queries
- Use recording rules
- Optimize PromQL queries
- Add indexes to time series

### Debug Commands
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check metrics endpoint
curl http://localhost:8081/actuator/prometheus

# Check Grafana data sources
curl http://localhost:3001/api/datasources
```

## 📚 Resources

- **Prometheus Documentation**: https://prometheus.io/docs/
- **Grafana Documentation**: https://grafana.com/docs/
- **PromQL Reference**: https://prometheus.io/docs/prometheus/latest/querying/
- **Spring Boot Metrics**: https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html

---

**Happy Monitoring! 📊✨** 