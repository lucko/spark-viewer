import React from 'react';

import { Avatar } from '../viewer/meta';

export function HeapTitle({ metadata }) {
    const { user } = metadata;

    document.title = 'spark | heap summary';

    return (
        <div className="text-box title">
            <span>
                Heap Summary created by <Avatar user={user} />
                {user.name}
            </span>
        </div>
    );
}
