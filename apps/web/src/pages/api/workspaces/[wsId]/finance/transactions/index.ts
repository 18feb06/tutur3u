import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { wsId } = req.query;

    if (!wsId || typeof wsId !== 'string') throw new Error('Invalid wsId');

    switch (req.method) {
      case 'GET':
        return await fetchTransactions(req, res, wsId);

      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`
        );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        message: 'Something went wrong',
      },
    });
  }
};

export default handler;

const fetchTransactions = async (
  req: NextApiRequest,
  res: NextApiResponse,
  wsId: string
) => {
  const supabase = createServerSupabaseClient({
    req,
    res,
  });

  const { walletIds } = req.query;

  const queryBuilder = supabase
    .from('wallet_transactions')
    .select(
      // 'transaction_categories!inner(name, ws_id)'
      'id, description, amount, category_id, workspace_wallets!inner(ws_id)'
    )
    .order('created_at', { ascending: false })
    .eq('workspace_wallets.ws_id', wsId);

  if (walletIds && typeof walletIds === 'string') {
    queryBuilder.in('wallet_id', walletIds.split(','));
  }

  const { data, error } = await queryBuilder;

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};