'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

import { v4 as UUIDv4 } from 'uuid';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Workspace } from '@/types/primitives/Workspace';
import Image from 'next/image';
import { downloadPrivateObject, uploadObject } from '@/lib/storage-helper';

interface Props {
  workspace: Workspace;
  defaultValue?: string;
  disabled?: boolean;
}

export default function LogoInput({ workspace, disabled }: Props) {
  const bucket = 'workspaces';

  const router = useRouter();
  const supabase = createClientComponentClient();

  const [file, setFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (workspace.logo_url)
      downloadPrivateObject({
        supabase,
        bucket,
        path: workspace.logo_url,
        onSuccess: setLogoUrl,
      });
  }, [workspace.logo_url, supabase]);

  const uploadLogo = async () => {
    uploadObject({
      supabase,
      bucket,
      file,
      path: `${workspace.id}/${UUIDv4()}`,
      beforeStart: () => setUploading(true),
      onComplete: () => setUploading(false),
      onSuccess: async (url) => {
        const { error: updateError } = await supabase
          .from('workspaces')
          .update({ logo_url: url })
          .eq('id', workspace.id);

        if (updateError) {
          toast({
            title: 'Error uploading logo',
            description: 'There was an error uploading the logo.',
          });
          return;
        }

        toast({
          title: 'Workspace updated',
          description: 'Workspace logo updated successfully.',
        });

        setFile(null);
        router.refresh();
      },
      onError: () => {
        toast({
          title: 'Error uploading logo',
          description: 'There was an error uploading the logo.',
        });
      },
    });
  };

  return (
    <>
      {logoUrl ? (
        <div className="mb-4 flex items-center justify-center">
          <Image
            width={320}
            height={80}
            src={logoUrl}
            alt="Logo"
            className="rounded-lg"
          />
        </div>
      ) : null}

      <div className="flex items-start gap-2">
        <Input
          id="single"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={disabled}
        />

        <Button
          type="submit"
          size="icon"
          onClick={uploadLogo}
          disabled={!file || uploading}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Check className="h-5 w-5" />
          )}
        </Button>
      </div>
    </>
  );
}
