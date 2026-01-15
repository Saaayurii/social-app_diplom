'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FallbackProfilePhoto } from './FallbackProfilePhoto';

export function ProfilePhoto({
  name,
  photoUrl,
  username,
  fallbackAvatarClassName,
}: {
  name: string;
  username: string;
  photoUrl?: string | null;
  fallbackAvatarClassName?: string;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/${username}`}>
      {photoUrl && !imageError ? (
        <img
          src={photoUrl}
          alt={`${name}'s avatar`}
          className="h-full w-full cursor-pointer rounded-full bg-muted object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <FallbackProfilePhoto name={name} className={fallbackAvatarClassName} />
      )}
    </Link>
  );
}
