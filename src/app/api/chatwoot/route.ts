import { NextResponse } from 'next/server';
import axios from 'axios';

const BaseUrl = `${process.env.BASE_URL_SUPPORT}`;
const ApiAccessToken = `${process.env.SUPPORT_API_ACCESS_TOKEN}`;
const AccountId = `${process.env.SUPPORT_ACCOUNT_ID}`;

const config = {
  headers: {
    api_access_token: ApiAccessToken,
    'Content-Type': 'application/json; charset=utf-8'
  }
};

async function createContactIfNotExists(email: string, name: string, source: string) {
  try {
    const contactResponse = await axios.get(`${BaseUrl}/api/v1/accounts/${AccountId}/contacts/search`, {
      ...config,
      params: { q: email }
    });

    let contact = contactResponse.data.payload.find((c: any) => c.email === email.toLowerCase().trim());
    const inboxId = source === 'Feedback' ? 26 : source === 'Copyright Removal Request' ? 28 : 27;

    if (!contact) {
      const createContactResponse = await axios.post(
        `${BaseUrl}/api/v1/accounts/${AccountId}/contacts`,
        {
          inbox_id: inboxId,
          name,
          email
        },
        config
      );
      contact = createContactResponse.data.payload.contact;
    }

    return contact;
  } catch (error) {
    console.error('Error fetching or creating contact:', error);
    throw new Error('Error in contact handling');
  }
}

async function createConversation(sourceId: string, contactId: number, message: string, source: string) {
  try {
    const content = `${source}\n\n${message}`;
    const inboxId = source === 'Feedback' ? 26 : source === 'Copyright Removal Request' ? 28 : 27;

    await axios.post(
      `${BaseUrl}/api/v1/accounts/${AccountId}/conversations`,
      {
        source_id: sourceId,
        inbox_id: inboxId,
        contact_id: contactId,
        message: { content, message_type: 'incoming' }
      },
      config
    );
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw new Error('Error creating conversation');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, source } = body;

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const contact = await createContactIfNotExists(email, name, source);
    const sourceId = contact.contact_inboxes[0].source_id;

    await createConversation(sourceId, contact.id, message, source);

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST instead.' }, { status: 405 });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
