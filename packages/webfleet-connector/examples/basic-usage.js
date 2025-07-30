/**
 * Webfleet Connector - Basic Usage Examples
 * 
 * This file contains practical examples of how to use the Webfleet connector
 * in various logistics scenarios.
 */

// Example 1: Basic Fleet Status Monitoring
const fleetStatusWorkflow = {
  name: "Fleet Status Dashboard",
  description: "Get real-time status of entire fleet",
  nodes: [
    {
      name: "Get All Vehicles",
      type: "webfleet",
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        resource: "vehicle",
        operation: "getAll",
        additionalParameters: {
          limit: 50
        }
      }
    },
    {
      name: "Get Vehicle Positions",
      type: "webfleet", 
      typeVersion: 1,
      position: [450, 300],
      parameters: {
        resource: "vehicle",
        operation: "getPosition",
        vehicleObjectName: "={{$json.objectNo}}"
      }
    },
    {
      name: "Merge Vehicle Data",
      type: "merge",
      typeVersion: 1,
      position: [650, 300],
      parameters: {
        mode: "combine",
        combinationMode: "mergeByPosition"
      }
    }
  ],
  connections: {
    "Get All Vehicles": {
      main: [[{ node: "Get Vehicle Positions", type: "main", index: 0 }]]
    },
    "Get Vehicle Positions": {
      main: [[{ node: "Merge Vehicle Data", type: "main", index: 0 }]]
    }
  }
};

// Example 2: Driver Compliance Monitoring
const driverComplianceWorkflow = {
  name: "Driver Compliance Check",
  description: "Monitor driver working time compliance",
  nodes: [
    {
      name: "Schedule Trigger",
      type: "cron",
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        rule: {
          hour: 18,
          minute: 0,
          weekday: [1, 2, 3, 4, 5] // Monday to Friday
        }
      }
    },
    {
      name: "Get All Drivers",
      type: "webfleet",
      typeVersion: 1,
      position: [450, 300],
      parameters: {
        resource: "driver",
        operation: "getAll"
      }
    },
    {
      name: "Get Working Times",
      type: "webfleet",
      typeVersion: 1,
      position: [650, 300],
      parameters: {
        resource: "driver",
        operation: "getWorkingTimes",
        driverObjectName: "={{$json.driverNo}}",
        rangeFrom: "={{$now.minus({days: 1}).startOf('day').toISO()}}",
        rangeTo: "={{$now.minus({days: 1}).endOf('day').toISO()}}"
      }
    },
    {
      name: "Check Violations",
      type: "function",
      typeVersion: 1,
      position: [850, 300],
      parameters: {
        functionCode: `
          const workingTime = items[0].json;
          const violations = workingTime.violations || [];
          
          // Check for working time violations
          const hasViolations = violations.length > 0;
          const excessiveHours = workingTime.workingTime > (11 * 3600); // 11 hours in seconds
          
          if (hasViolations || excessiveHours) {
            return [{
              json: {
                driverNo: workingTime.driverNo,
                driverName: workingTime.driverName,
                date: workingTime.date,
                workingTime: workingTime.workingTime / 3600, // Convert to hours
                violations: violations,
                excessiveHours,
                alertLevel: violations.some(v => v.severity === 'high') ? 'HIGH' : 'MEDIUM'
              }
            }];
          }
          
          return [];
        `
      }
    },
    {
      name: "Send Alert",
      type: "gmail",
      typeVersion: 1,
      position: [1050, 300],
      parameters: {
        operation: "send",
        email: "fleet-manager@company.com",
        subject: "Driver Compliance Alert - {{$json.driverName}}",
        message: `
          Driver Compliance Violation Detected:
          
          Driver: {{$json.driverName}} ({{$json.driverNo}})
          Date: {{$json.date}}
          Working Time: {{$json.workingTime}} hours
          Alert Level: {{$json.alertLevel}}
          
          Violations:
          {{$json.violations}}
        `
      }
    }
  ]
};

// Example 3: Geofence Alert System
const geofenceAlertWorkflow = {
  name: "Geofence Alert System",
  description: "Monitor geofence entries and exits",
  nodes: [
    {
      name: "Interval Trigger",
      type: "interval",
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        interval: 300 // 5 minutes
      }
    },
    {
      name: "Get Recent Events",
      type: "webfleet",
      typeVersion: 1,
      position: [450, 300],
      parameters: {
        resource: "event",
        operation: "getAll",
        rangeFrom: "={{$now.minus({minutes: 5}).toISO()}}",
        rangeTo: "={{$now.toISO()}}"
      }
    },
    {
      name: "Filter Geofence Events",
      type: "function",
      typeVersion: 1,
      position: [650, 300],
      parameters: {
        functionCode: `
          return items.filter(item => {
            const event = item.json;
            return event.eventType === 'geofence' && 
                   ['entry', 'exit'].includes(event.description.toLowerCase());
          });
        `
      }
    },
    {
      name: "Get Vehicle Details",
      type: "webfleet",
      typeVersion: 1,
      position: [850, 300],
      parameters: {
        resource: "vehicle",
        operation: "get",
        vehicleObjectName: "={{$json.objectNo}}"
      }
    },
    {
      name: "Send Webhook Notification",
      type: "webhook",
      typeVersion: 1,
      position: [1050, 300],
      parameters: {
        httpMethod: "POST",
        url: "https://your-webhook-endpoint.com/geofence-alert",
        options: {
          headers: {
            "Content-Type": "application/json"
          }
        },
        body: {
          eventType: "={{$json.eventType}}",
          vehicleId: "={{$json.objectNo}}",
          vehicleName: "={{$json.objectName}}",
          location: "={{$json.location}}",
          timestamp: "={{$json.timestamp}}",
          geofenceName: "={{$json.geofenceName}}"
        }
      }
    }
  ]
};

// Example 4: Fuel Efficiency Analysis
const fuelEfficiencyWorkflow = {
  name: "Weekly Fuel Efficiency Report",
  description: "Generate weekly fuel efficiency reports",
  nodes: [
    {
      name: "Weekly Schedule",
      type: "cron",
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        rule: {
          hour: 9,
          minute: 0,
          weekday: 1 // Monday
        }
      }
    },
    {
      name: "Get Fuel Report",
      type: "webfleet",
      typeVersion: 1,
      position: [450, 300],
      parameters: {
        resource: "report",
        operation: "fuelConsumption",
        rangeFrom: "={{$now.minus({weeks: 1}).startOf('week').toISO()}}",
        rangeTo: "={{$now.minus({weeks: 1}).endOf('week').toISO()}}"
      }
    },
    {
      name: "Analyze Efficiency",
      type: "function",
      typeVersion: 1,
      position: [650, 300],
      parameters: {
        functionCode: `
          const report = items[0].json;
          const vehicles = report.fuelData || [];
          
          // Calculate statistics
          const totalFuel = vehicles.reduce((sum, v) => sum + v.fuelConsumed, 0);
          const totalDistance = vehicles.reduce((sum, v) => sum + v.distance, 0);
          const averageEfficiency = totalDistance / totalFuel;
          
          // Find best and worst performers
          const sortedByEfficiency = vehicles.sort((a, b) => b.fuelEfficiency - a.fuelEfficiency);
          const bestPerformer = sortedByEfficiency[0];
          const worstPerformer = sortedByEfficiency[sortedByEfficiency.length - 1];
          
          // Identify vehicles needing attention (below 80% of average)
          const threshold = averageEfficiency * 0.8;
          const needsAttention = vehicles.filter(v => v.fuelEfficiency < threshold);
          
          return [{
            json: {
              period: {
                from: report.reportPeriod.from,
                to: report.reportPeriod.to
              },
              summary: {
                totalVehicles: vehicles.length,
                totalFuelConsumed: totalFuel,
                totalDistance: totalDistance,
                averageEfficiency: averageEfficiency,
                totalCO2Emission: vehicles.reduce((sum, v) => sum + v.co2Emission, 0)
              },
              performance: {
                bestPerformer: {
                  vehicle: bestPerformer.vehicleName,
                  efficiency: bestPerformer.fuelEfficiency
                },
                worstPerformer: {
                  vehicle: worstPerformer.vehicleName,
                  efficiency: worstPerformer.fuelEfficiency
                }
              },
              alerts: {
                count: needsAttention.length,
                vehicles: needsAttention.map(v => ({
                  name: v.vehicleName,
                  efficiency: v.fuelEfficiency,
                  deviation: ((averageEfficiency - v.fuelEfficiency) / averageEfficiency * 100).toFixed(1)
                }))
              }
            }
          }];
        `
      }
    },
    {
      name: "Generate Report",
      type: "function",
      typeVersion: 1,
      position: [850, 300],
      parameters: {
        functionCode: `
          const data = items[0].json;
          
          const report = \`
# Weekly Fuel Efficiency Report

**Period:** \${data.period.from} to \${data.period.to}

## Summary
- **Total Vehicles:** \${data.summary.totalVehicles}
- **Total Fuel Consumed:** \${data.summary.totalFuelConsumed.toFixed(2)} L
- **Total Distance:** \${data.summary.totalDistance.toFixed(2)} km
- **Average Efficiency:** \${data.summary.averageEfficiency.toFixed(2)} km/L
- **Total CO2 Emissions:** \${data.summary.totalCO2Emission.toFixed(2)} kg

## Performance Highlights
- **Best Performer:** \${data.performance.bestPerformer.vehicle} (\${data.performance.bestPerformer.efficiency.toFixed(2)} km/L)
- **Needs Improvement:** \${data.performance.worstPerformer.vehicle} (\${data.performance.worstPerformer.efficiency.toFixed(2)} km/L)

## Vehicles Requiring Attention (\${data.alerts.count})
\${data.alerts.vehicles.map(v => 
  \`- **\${v.name}:** \${v.efficiency.toFixed(2)} km/L (\${v.deviation}% below average)\`
).join('\\n')}

## Recommendations
1. Schedule maintenance for vehicles with efficiency below 80% of fleet average
2. Provide eco-driving training for drivers of underperforming vehicles
3. Consider route optimization for frequently used routes
          \`;
          
          return [{
            json: {
              report: report,
              data: data
            }
          }];
        `
      }
    },
    {
      name: "Email Report",
      type: "gmail",
      typeVersion: 1,
      position: [1050, 300],
      parameters: {
        operation: "send",
        email: "fleet-manager@company.com",
        subject: "Weekly Fuel Efficiency Report - {{$now.minus({weeks: 1}).toFormat('yyyy-MM-dd')}}",
        message: "={{$json.report}}"
      }
    }
  ]
};

// Example 5: Real-time Vehicle Tracking
const realTimeTrackingWorkflow = {
  name: "Real-time Vehicle Tracking",
  description: "Track specific vehicles in real-time",
  nodes: [
    {
      name: "HTTP Trigger",
      type: "webhook",
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        httpMethod: "POST",
        path: "track-vehicle",
        responseMode: "responseNode"
      }
    },
    {
      name: "Get Vehicle Position",
      type: "webfleet",
      typeVersion: 1,
      position: [450, 300],
      parameters: {
        resource: "vehicle",
        operation: "getPosition",
        vehicleObjectName: "={{$json.body.vehicleId}}"
      }
    },
    {
      name: "Get Recent Trips",
      type: "webfleet",
      typeVersion: 1,
      position: [450, 450],
      parameters: {
        resource: "vehicle",
        operation: "getTrips",
        vehicleObjectName: "={{$json.body.vehicleId}}",
        rangeFrom: "={{$now.minus({hours: 24}).toISO()}}",
        rangeTo: "={{$now.toISO()}}"
      }
    },
    {
      name: "Get Recent Events",
      type: "webfleet",
      typeVersion: 1,
      position: [450, 600],
      parameters: {
        resource: "event",
        operation: "getAll",
        rangeFrom: "={{$now.minus({hours: 24}).toISO()}}",
        rangeTo: "={{$now.toISO()}}"
      }
    },
    {
      name: "Combine Data",
      type: "merge",
      typeVersion: 1,
      position: [650, 450],
      parameters: {
        mode: "combine",
        combinationMode: "mergeByPosition"
      }
    },
    {
      name: "Format Response",
      type: "function",
      typeVersion: 1,
      position: [850, 450],
      parameters: {
        functionCode: `
          const position = items[0].json;
          const trips = items[1].json || [];
          const events = items[2].json || [];
          
          // Filter events for this vehicle
          const vehicleEvents = events.filter(e => e.objectNo === position.objectNo);
          
          return [{
            json: {
              vehicle: {
                id: position.objectNo,
                name: position.objectName,
                position: {
                  latitude: position.latitude,
                  longitude: position.longitude,
                  address: position.address,
                  speed: position.speed,
                  heading: position.heading,
                  timestamp: position.timestamp
                },
                status: {
                  isMoving: position.isMoving,
                  isEngineOn: position.isEngineOn,
                  fuelLevel: position.fuelLevel,
                  odometer: position.odometer
                }
              },
              trips: {
                count: trips.length,
                totalDistance: trips.reduce((sum, t) => sum + t.distance, 0),
                totalDuration: trips.reduce((sum, t) => sum + t.duration, 0),
                recent: trips.slice(0, 5).map(trip => ({
                  startTime: trip.startTime,
                  endTime: trip.endTime,
                  distance: trip.distance,
                  avgSpeed: trip.avgSpeed,
                  startAddress: trip.startLocation.address,
                  endAddress: trip.endLocation.address
                }))
              },
              events: {
                count: vehicleEvents.length,
                recent: vehicleEvents.slice(0, 10).map(event => ({
                  type: event.eventType,
                  severity: event.severity,
                  timestamp: event.timestamp,
                  location: event.location.address,
                  description: event.description
                }))
              },
              lastUpdated: new Date().toISOString()
            }
          }];
        `
      }
    },
    {
      name: "Respond",
      type: "respondToWebhook",
      typeVersion: 1,
      position: [1050, 450],
      parameters: {
        respondWith: "json",
        responseBody: "={{$json}}"
      }
    }
  ]
};

// Example 6: Automated Maintenance Alerts
const maintenanceAlertWorkflow = {
  name: "Maintenance Alert System",
  description: "Monitor vehicles for maintenance requirements",
  nodes: [
    {
      name: "Daily Check",
      type: "cron",
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        rule: {
          hour: 8,
          minute: 0
        }
      }
    },
    {
      name: "Get All Vehicles",
      type: "webfleet",
      typeVersion: 1,
      position: [450, 300],
      parameters: {
        resource: "vehicle",
        operation: "getAll"
      }
    },
    {
      name: "Check Maintenance Due",
      type: "function",
      typeVersion: 1,
      position: [650, 300],
      parameters: {
        functionCode: `
          const maintenanceIntervals = {
            oil_change: 10000, // km
            brake_check: 30000, // km
            tire_rotation: 20000, // km
            annual_inspection: 50000 // km
          };
          
          const alerts = [];
          
          for (const vehicle of items) {
            const v = vehicle.json;
            const currentOdometer = v.odometer;
            
            // Get last maintenance records (this would typically come from a database)
            // For demo purposes, we'll simulate this
            const lastMaintenance = {
              oil_change: currentOdometer - 9500,
              brake_check: currentOdometer - 28000,
              tire_rotation: currentOdometer - 19500,
              annual_inspection: currentOdometer - 45000
            };
            
            for (const [type, interval] of Object.entries(maintenanceIntervals)) {
              const kmSinceLastService = currentOdometer - lastMaintenance[type];
              const kmUntilService = interval - kmSinceLastService;
              
              if (kmUntilService <= 1000) { // Alert when within 1000km
                alerts.push({
                  vehicleId: v.objectNo,
                  vehicleName: v.objectName,
                  maintenanceType: type,
                  currentOdometer: currentOdometer,
                  kmUntilService: kmUntilService,
                  isOverdue: kmUntilService < 0,
                  priority: kmUntilService < 0 ? 'HIGH' : 'MEDIUM'
                });
              }
            }
          }
          
          return alerts.map(alert => ({ json: alert }));
        `
      }
    },
    {
      name: "Send Alert",
      type: "gmail",
      typeVersion: 1,
      position: [850, 300],
      parameters: {
        operation: "send",
        email: "maintenance@company.com",
        subject: "{{$json.priority}} Priority Maintenance Alert - {{$json.vehicleName}}",
        message: `
          Maintenance Alert:
          
          Vehicle: {{$json.vehicleName}} ({{$json.vehicleId}})
          Maintenance Type: {{$json.maintenanceType}}
          Current Odometer: {{$json.currentOdometer}} km
          Status: {{$json.isOverdue ? 'OVERDUE by ' + Math.abs($json.kmUntilService) + ' km' : 'Due in ' + $json.kmUntilService + ' km'}}
          Priority: {{$json.priority}}
          
          Please schedule maintenance as soon as possible.
        `
      }
    }
  ]
};

// Export all examples
module.exports = {
  fleetStatusWorkflow,
  driverComplianceWorkflow,
  geofenceAlertWorkflow,
  fuelEfficiencyWorkflow,
  realTimeTrackingWorkflow,
  maintenanceAlertWorkflow
};

// Usage Instructions:
// 
// 1. Import these workflows into your n8n instance
// 2. Configure your Webfleet API credentials
// 3. Modify email addresses and webhook URLs as needed
// 4. Adjust schedules and parameters for your specific requirements
// 5. Test each workflow with a small dataset first
//
// Note: These examples assume you have proper error handling
// and rate limiting in place. In production, add appropriate
// error handling nodes and consider implementing retry logic.