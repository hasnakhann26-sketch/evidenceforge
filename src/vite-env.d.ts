/// <reference types="vite/client" />

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_AI_PROVIDER: string;
  readonly VITE_AI_MODEL: string;
  readonly VITE_AI_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
