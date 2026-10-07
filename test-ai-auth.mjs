import { readFileSync } from 'fs';

const AI_URL = 'https://axthmghawwishcjlldfj.supabase.co/functions/v1/smart-service';

// احصل على JWT جديد
const authRes = await fetch('https://axthmghawwishcjlldfj.supabase.co/auth/v1/token?grant_type=password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'sb_publishable_65sfnmWes7WZbqKmJ931-g_aakVowXY'
  },
  body: JSON.stringify({ email: 'test@rashaqa.app', password: 'Test123456!' })
});
const { access_token } = await authRes.json();

console.log('🎫 JWT obtained:', access_token ? access_token.substring(0, 30) + '...' : 'FAILED');
if (!access_token) process.exit(1);

// اختبر AI
console.log('\n🤖 Calling AI suggest...');
const aiRes = await fetch(AI_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    action: 'suggest',
    body: { country: 'MA', goal: 'maintain', remainingCalories: 800 }
  })
});

const result = await aiRes.json();
console.log('\n📦 Response:');
console.log(JSON.stringify(result, null, 2));
