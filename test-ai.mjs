const AI_URL = 'https://axthmghawwishcjlldfj.supabase.co/functions/v1/smart-service';

const res = await fetch(AI_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'suggest',
    body: { country: 'MA', goal: 'maintain', remainingCalories: 800 }
  })
});
console.log(await res.json());
