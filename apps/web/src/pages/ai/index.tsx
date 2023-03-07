import React, { ReactElement, useEffect, useState } from 'react';
import NestedLayout from '../../components/layouts/NestedLayout';
import { useAppearance } from '../../hooks/useAppearance';
import { Textarea } from '@mantine/core';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not logged in, redirect to login page
  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  // If user's email does not end with @tuturuuu.com, redirect to home page
  if (!session.user?.email || !session.user.email.endsWith('@tuturuuu.com'))
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

const GPTPage = () => {
  const { setRootSegment } = useAppearance();

  useEffect(() => {
    setRootSegment({
      content: 'Tuturuuu AI',
      href: '/ai',
    });
  }, [setRootSegment]);

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const [loading, setLoading] = useState(false);

  const generateBio = async () => {
    setResponse('');
    setLoading(true);
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResponse((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex h-full flex-col gap-2">
          <h2 className="text-2xl font-semibold text-blue-300">Prompt</h2>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            minRows={5}
            placeholder="Enter your prompt here."
          />

          <button
            className={`mt-1 rounded border border-blue-300/20 bg-blue-300/10 px-4 py-3 font-semibold text-blue-300 transition ${
              !prompt || loading
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-blue-300/20'
            }`}
            onClick={
              prompt && !loading
                ? (e) => {
                    e.preventDefault();
                    generateBio();
                  }
                : undefined
            }
          >
            Generate
          </button>
        </div>

        <div className="flex h-full flex-col gap-2">
          <h2 className="text-2xl font-semibold text-blue-300">Response</h2>

          <div className="h-full rounded-lg border border-zinc-700 bg-zinc-800 p-4">
            {response ? (
              <>
                <div>
                  <p className="whitespace-pre-wrap">{response}</p>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-2xl font-semibold text-zinc-500">
                {loading ? 'Generating...' : 'No response yet.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

GPTPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout mode="document">{page}</NestedLayout>;
};

export default GPTPage;