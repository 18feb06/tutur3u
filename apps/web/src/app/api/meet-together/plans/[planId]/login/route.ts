import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/client';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    planId: string;
  };
}

export async function POST(
  req: Request,
  { params: { planId: rawPlanId } }: Params
) {
  // rawPlanId is an uuid without dashes,
  // we'll have to add them back to make it a valid uuid
  const planId = rawPlanId.replace(
    /^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/,
    '$1-$2-$3-$4-$5'
  );

  // if planId isn't a valid uuid
  if (planId.length !== 36) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const sbAdmin = createAdminClient();

  // if we can't initialize the admin client
  if (!sbAdmin) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }

  const { name, password } = await req.json();

  if (!name)
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });

  // Fetch guest by name and planId
  const { data: guest, error } = await sbAdmin
    .from('meet_together_guests')
    .select('id, name, password_hash, password_salt')
    .eq('plan_id', planId)
    .eq('name', name)
    .maybeSingle();

  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error while fetching guest' },
      { status: 500 }
    );
  }

  // If guest does not exist, create a new one
  if (!guest?.name) {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const { data, error } = await sbAdmin
      .from('meet_together_guests')
      .insert({
        id: `${rawPlanId}-${name}`,
        name,
        plan_id: planId,
        password_hash: hashedPassword,
        password_salt: salt,
      })
      .select('name')
      .single();

    if (error) {
      console.log(error);
      return NextResponse.json(
        { message: 'Error while creating guest' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: {
        name: data.name,
        plan_id: planId,
      },
      message: 'Created new guest',
    });
  }

  // If guest exists, check password
  const hashedPassword = await hashPassword(password, guest.password_salt);
  if (hashedPassword === guest.password_hash)
    return NextResponse.json({
      user: {
        id: guest.id,
        name: guest.name,
        passwordHash: hashedPassword,
        planId,
        isGuest: true,
      },
      message: 'Logged in',
    });

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}

function generateSalt() {
  return crypto.randomBytes(10).toString('hex');
}

async function hashPassword(password: string, salt: string) {
  // concatenate the password and salt
  const passwordWithSalt = password + salt;

  // use native crypto to hash the password
  const hashedPassword = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(passwordWithSalt)
  );

  // convert the hashed password to a string
  const hashedPasswordStr = new Uint8Array(hashedPassword).join('');
  const hashedPasswordHex = parseInt(hashedPasswordStr)
    .toString(16)
    .replace(/0+$/, '');

  return hashedPasswordHex;
}
