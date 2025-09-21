// MongoDB initialization script for Docker
db = db.getSiblingDB('esencelab');

// Create collections
db.createCollection('users');
db.createCollection('jobs');
db.createCollection('courses');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "skills.name": 1 });
db.jobs.createIndex({ "title": "text", "description": "text" });
db.jobs.createIndex({ "company.name": 1 });
db.jobs.createIndex({ "status": 1 });
db.courses.createIndex({ "title": "text", "description": "text" });
db.courses.createIndex({ "provider.name": 1 });

print('Database initialized successfully!');
