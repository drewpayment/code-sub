#!/usr/bin/env node

import { exec } from 'child_process';

exec('stripe listen --forward-to localhost:5173/api/webhooks/stripe');