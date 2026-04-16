import { corsHeaders } from '@supabase/supabase-js/cors'

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
  if (!TELEGRAM_API_KEY) {
    return new Response(JSON.stringify({ error: 'TELEGRAM_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
  if (!CHAT_ID) {
    return new Response(JSON.stringify({ error: 'TELEGRAM_CHAT_ID not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !message) {
      return new Response(JSON.stringify({ error: 'name and message are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const text = `📩 <b>Новое сообщение с сайта</b>\n\n👤 <b>Имя:</b> ${name}\n📧 <b>Email:</b> ${email || 'не указан'}\n\n💬 <b>Сообщение:</b>\n${message}`;

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Telegram API failed [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending Telegram message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
