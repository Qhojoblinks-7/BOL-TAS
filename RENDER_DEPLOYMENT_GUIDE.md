# Deploying BOL-TAS Django Backend on Render

## Overview

This guide provides step-by-step instructions for deploying the BOL-TAS Django backend to Render. Render is a cloud platform that provides managed services for web applications, databases, and background workers.

## Prerequisites

- Render account (free tier available)
- GitHub repository with the Django backend code
- Basic understanding of Django deployment

## Architecture on Render

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Django Backend │    │  PostgreSQL DB  │
│     (Static)    │◄──►│   (Web Service) │◄──►│  (Managed DB)   │
│                 │    │                 │    │                 │
│   render.com    │    │   render.com    │    │   render.com    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Redis (Optional) │
                       │   (For Caching)   │
                       │   render.com      │
                       └─────────────────┘
```

## Step 1: Prepare Your Django Project

### 1.1 Create Requirements Files

Create `requirements.txt` in your Django project root:

```txt
Django==4.2.11
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
psycopg2-binary==2.9.9
redis==5.0.1
celery==5.3.4
django-cors-headers==4.3.1
Pillow==10.2.0
boto3==1.34.34
django-storages==1.14.2
sentry-sdk==1.39.2
drf-spectacular==0.26.5
gunicorn==21.2.0
whitenoise==6.6.0
python-decouple==3.8
```

Create `requirements-dev.txt` for development:

```txt
-r requirements.txt
pytest==7.4.3
pytest-django==4.7.0
factory-boy==3.3.0
black==23.12.1
isort==5.13.2
flake8==6.1.0
```

### 1.2 Environment Configuration

Create `.env.example` file:

```bash
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com,localhost,127.0.0.1

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Redis Configuration (Optional)
REDIS_URL=redis://your-redis-instance:6379

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=1440

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1
AWS_S3_CUSTOM_DOMAIN=your-cdn-domain.com

# Firebase Configuration (Optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Sentry Configuration (Optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-frontend-domain.onrender.com
CORS_ALLOW_CREDENTIALS=True

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_TYPE_NOSNIFF=True
X_FRAME_OPTIONS=DENY
```

### 1.3 Django Settings for Production

Create `boltas/settings/production.py`:

```python
import os
from decouple import config
from .base import *

# Production settings
DEBUG = False
SECRET_KEY = config('SECRET_KEY')

# Hosts
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Redis (Optional)
REDIS_URL = config('REDIS_URL', default=None)
if REDIS_URL:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': REDIS_URL,
        }
    }

    # Celery Configuration
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = REDIS_URL

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=config('JWT_ACCESS_TOKEN_LIFETIME', default=15, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=config('JWT_REFRESH_TOKEN_LIFETIME', default=1, cast=int)),
    'SIGNING_KEY': config('JWT_SECRET_KEY', default=SECRET_KEY),
}

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='us-east-1')
AWS_S3_CUSTOM_DOMAIN = config('AWS_S3_CUSTOM_DOMAIN', default=None)

if AWS_ACCESS_KEY_ID:
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    AWS_DEFAULT_ACL = 'public-read'
    AWS_LOCATION = 'static'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/' if AWS_S3_CUSTOM_DOMAIN else f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/static/'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

    # Media files
    DEFAULT_FILE_STORAGE = 'boltas.storage_backends.MediaStorage'

# CORS Configuration
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
CORS_ALLOW_CREDENTIALS = config('CORS_ALLOW_CREDENTIALS', default=True, cast=bool)

# Security Headers
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=True, cast=bool)
CSRF_COOKIE_SECURE = config('CSRF_COOKIE_SECURE', default=True, cast=bool)
SECURE_BROWSER_XSS_FILTER = config('SECURE_BROWSER_XSS_FILTER', default=True, cast=bool)
SECURE_CONTENT_TYPE_NOSNIFF = config('SECURE_CONTENT_TYPE_NOSNIFF', default=True, cast=bool)
X_FRAME_OPTIONS = config('X_FRAME_OPTIONS', default='DENY')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'boltas': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

### 1.4 Create Render Configuration Files

Create `render.yaml` for Render's infrastructure as code:

```yaml
services:
  - type: web
    name: boltas-api
    runtime: python3
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn boltas.wsgi:application --bind 0.0.0.0:$PORT"
    envVars:
      - key: DJANGO_SETTINGS_MODULE
        value: boltas.settings.production
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: false
      - key: DATABASE_URL
        fromDatabase:
          name: boltas-db
          property: connectionString
      - key: ALLOWED_HOSTS
        fromService:
          type: web
          name: boltas-api
          property: host
      - key: CORS_ALLOWED_ORIGINS
        fromService:
          type: web
          name: boltas-frontend
          property: host

  - type: pserv
    name: boltas-db
    runtime: postgresql
    ipAllowList: []  # Only accessible by other services

  - type: redis
    name: boltas-redis
    ipAllowList: []  # Only accessible by other services

  - type: worker
    name: boltas-worker
    runtime: python3
    buildCommand: "pip install -r requirements.txt"
    startCommand: "celery -A boltas worker -l info"
    envVars:
      - key: DJANGO_SETTINGS_MODULE
        value: boltas.settings.production
      - key: DATABASE_URL
        fromDatabase:
          name: boltas-db
          property: connectionString
      - key: REDIS_URL
        fromRedis:
          name: boltas-redis
          property: connectionString

  - type: cron
    name: boltas-beat
    runtime: python3
    buildCommand: "pip install -r requirements.txt"
    schedule: "0 1 * * 1"  # Every Monday at 1 AM
    startCommand: "celery -A boltas beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler"
    envVars:
      - key: DJANGO_SETTINGS_MODULE
        value: boltas.settings.production
      - key: DATABASE_URL
        fromDatabase:
          name: boltas-db
          property: connectionString
      - key: REDIS_URL
        fromRedis:
          name: boltas-redis
          property: connectionString
```

Create `render-build.sh` for custom build steps:

```bash
#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput --clear

# Create superuser if it doesn't exist
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@bol-tas.com').exists() or User.objects.create_superuser('admin@bol-tas.com', 'admin@bol-tas.com', 'admin123')" | python manage.py shell

# Load initial data
python manage.py loaddata initial_data.json
```

### 1.5 Create Initial Data Fixture

Create `boltas/fixtures/initial_data.json`:

```json
[
  {
    "model": "boltas.user",
    "pk": 1,
    "fields": {
      "email": "admin@bol-tas.com",
      "full_name": "Administrator",
      "role": "admin",
      "is_active": true,
      "is_staff": true,
      "is_superuser": true,
      "date_joined": "2024-01-01T00:00:00Z"
    }
  },
  {
    "model": "boltas.user",
    "pk": 2,
    "fields": {
      "email": "john@example.com",
      "full_name": "John Doe",
      "role": "teen",
      "personal_code": "12345",
      "is_active": true,
      "date_joined": "2024-01-15T10:00:00Z"
    }
  }
]
```

## Step 2: Deploy to Render

### 2.1 Create Render Account

1. Go to [render.com](https://render.com) and sign up for an account
2. Connect your GitHub account
3. Authorize Render to access your repository

### 2.2 Create PostgreSQL Database

1. In your Render dashboard, click "New" → "PostgreSQL"
2. Choose a name (e.g., `boltas-db`)
3. Select a region (choose one close to your users)
4. Choose the free tier or paid plan as needed
5. Click "Create Database"
6. Note down the connection details

### 2.3 Create Redis Instance (Optional)

1. Click "New" → "Redis"
2. Choose a name (e.g., `boltas-redis`)
3. Select the same region as your database
4. Choose the free tier
5. Click "Create Redis"

### 2.4 Create Web Service

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `boltas-api`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn boltas.wsgi:application --bind 0.0.0.0:$PORT`

4. Set environment variables:
   ```
   DJANGO_SETTINGS_MODULE=boltas.settings.production
   SECRET_KEY=your-generated-secret-key
   DEBUG=False
   DATABASE_URL=postgresql://user:password@host:port/database
   ALLOWED_HOSTS=your-service-name.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

5. Click "Create Web Service"

### 2.5 Create Background Worker (Optional)

1. Click "New" → "Background Worker"
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `boltas-worker`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `celery -A boltas worker -l info`

4. Set the same environment variables as the web service
5. Add Redis URL if using Redis
6. Click "Create Background Worker"

### 2.6 Configure Custom Domain (Optional)

1. Go to your web service settings
2. Click "Custom Domain"
3. Add your custom domain
4. Configure DNS records as instructed

## Step 3: Environment Variables Setup

### 3.1 Required Environment Variables

Set these in your Render service environment variables:

```bash
# Django Core
DJANGO_SETTINGS_MODULE=boltas.settings.production
SECRET_KEY=your-super-secret-key-here
DEBUG=False

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-frontend-domain.onrender.com
CORS_ALLOW_CREDENTIALS=True

# JWT
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=1440

# Redis (if using)
REDIS_URL=redis://your-redis-instance:6379

# File Storage (if using AWS S3)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-bucket
AWS_S3_REGION_NAME=us-east-1

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Sentry (optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### 3.2 Generate Secret Keys

Use Python to generate secure keys:

```python
import secrets
import string

# Generate SECRET_KEY
secret_key = ''.join(secrets.choice(string.ascii_letters + string.digits + string.punctuation) for i in range(50))
print(f"SECRET_KEY={secret_key}")

# Generate JWT_SECRET_KEY
jwt_secret = secrets.token_urlsafe(32)
print(f"JWT_SECRET_KEY={jwt_secret}")
```

## Step 4: Database Setup

### 4.1 Run Migrations

After deployment, your app will automatically run migrations. You can also run them manually:

1. Go to your Render service shell
2. Run: `python manage.py migrate`

### 4.2 Create Superuser

1. In the Render shell, run:
   ```bash
   python manage.py createsuperuser --email admin@bol-tas.com --noinput
   ```

2. Set the password:
   ```bash
   python manage.py shell -c "from django.contrib.auth import get_user_model; u = get_user_model().objects.get(email='admin@bol-tas.com'); u.set_password('your-admin-password'); u.save()"
   ```

### 4.3 Load Initial Data

1. Upload your fixture file to Render
2. Run: `python manage.py loaddata initial_data.json`

## Step 5: Testing Deployment

### 5.1 Health Check

Create a simple health check endpoint in your Django app:

```python
# views.py
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Check database connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()

        return JsonResponse({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': timezone.now().isoformat()
        })
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'error': str(e)
        }, status=500)
```

Add to `urls.py`:

```python
path('health/', health_check, name='health_check'),
```

### 5.2 Test API Endpoints

Use curl or Postman to test your endpoints:

```bash
# Health check
curl https://your-app.onrender.com/api/health/

# Get JWT token
curl -X POST https://your-app.onrender.com/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bol-tas.com", "password": "your-password"}'

# Test protected endpoint
curl https://your-app.onrender.com/api/users/ \
  -H "Authorization: Bearer your-jwt-token"
```

## Step 6: Monitoring & Maintenance

### 6.1 Logs

- View logs in Render dashboard under "Logs" tab
- Set up log retention and monitoring alerts

### 6.2 Backups

- Render automatically backs up PostgreSQL databases
- Configure backup frequency in database settings
- Download backups manually if needed

### 6.3 Scaling

- **Web Service**: Scale vertically by upgrading instance type
- **Database**: Scale by upgrading PostgreSQL plan
- **Background Workers**: Add multiple worker instances for high load

### 6.4 Cost Optimization

- Use free tier for development/testing
- Monitor usage in Render dashboard
- Set up billing alerts
- Use Redis only if needed for caching

## Step 7: Frontend Integration

### 7.1 Update Frontend Configuration

Update your React app's API base URL:

```javascript
// config.js
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-django-app.onrender.com/api'
  : 'http://localhost:8000/api';
```

### 7.2 CORS Configuration

Ensure your Django settings allow your frontend domain:

```python
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.onrender.com',
    'https://your-custom-domain.com',
]
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check requirements.txt for correct package versions
   - Ensure all dependencies are listed
   - Check for Python version compatibility

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database credentials
   - Ensure database is running

3. **Static Files Issues**
   - Run `collectstatic` during build
   - Configure AWS S3 if using external storage
   - Check STATIC_URL configuration

4. **CORS Errors**
   - Add frontend domain to CORS_ALLOWED_ORIGINS
   - Check for HTTPS vs HTTP issues

5. **Memory Issues**
   - Upgrade to larger instance type
   - Optimize Django settings
   - Use database indexes for large queries

### Getting Help

- Check Render documentation: https://docs.render.com/
- Django deployment docs: https://docs.djangoproject.com/en/4.2/howto/deployment/
- Community forums and Stack Overflow

## Security Checklist

- [ ] SECRET_KEY is unique and secure
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured correctly
- [ ] HTTPS enabled
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] File upload restrictions in place
- [ ] Rate limiting configured
- [ ] Security headers enabled

## Performance Optimization

1. **Database Optimization**
   - Add appropriate indexes
   - Use select_related/prefetch_related
   - Optimize queries

2. **Caching**
   - Use Redis for session storage
   - Cache frequently accessed data
   - Use Django's cache framework

3. **Static Files**
   - Use CDN for static assets
   - Enable compression
   - Optimize images

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor response times
   - Track resource usage

This deployment guide provides everything needed to successfully deploy the BOL-TAS Django backend on Render with production-ready configuration.</content>
</xai:function_call">The Render deployment guide has been created in `RENDER_DEPLOYMENT_GUIDE.md`. This comprehensive guide covers:

## Key Deployment Areas:

### **Project Preparation**
- Requirements files for dependencies
- Environment configuration with `.env.example`
- Production Django settings
- Initial data fixtures

### **Render Configuration**
- `render.yaml` for infrastructure as code
- Build scripts and deployment configuration
- Service definitions for web, database, Redis, and workers

### **Step-by-Step Deployment**
- Creating Render account and connecting GitHub
- Setting up PostgreSQL database
- Creating web service and background workers
- Environment variables configuration

### **Database & Data Setup**
- Running migrations
- Creating superuser
- Loading initial data
- Database optimization

### **Testing & Monitoring**
- Health check endpoints
- API testing procedures
- Log monitoring
- Backup strategies

### **Frontend Integration**
- CORS configuration
- API base URL setup
- Cross-origin request handling

### **Troubleshooting**
- Common deployment issues
- Performance optimization
- Security checklist
- Cost optimization tips

### **Production Considerations**
- Scaling options
- Monitoring setup
- Maintenance procedures
- Security best practices

The guide provides a complete roadmap for deploying the Django backend to Render, from initial setup through production monitoring and maintenance.