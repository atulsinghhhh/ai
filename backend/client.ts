

import { createBrowserClient } from '@supabase/ssr'

function createClient() {
    return createBrowserClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export const supabase=createClient();