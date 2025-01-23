/* tslint:disable */
/* eslint-disable */
/**
 * Each FFI function:
 * - Accepts minimal fields in a JavaScript-friendly manner (e.g. strings, JSON).
 * - Creates the Rust model, sanitizes, and validates it.
 * - Generates the ID (if applicable).
 * - Generates the path (if applicable).
 * - Returns { json, id, path, url } or a descriptive error.
 */
export class CreateResult {
  private constructor();
  free(): void;
  readonly id: string;
  readonly path: string;
  readonly url: string;
  readonly json: any;
}
/**
 * Represents a user's single link with a title and URL.
 */
export class PubkyAppSpecs {
  free(): void;
  /**
   * Creates a new `PubkyAppSpecs` instance.
   */
  constructor(pubky_id: string);
  createFollow(followee_id: string): CreateResult;
}
/**
 * URI: /pub/pubky.app/profile.json
 */
export class PubkyAppUser {
  free(): void;
  /**
   * Creates a new `PubkyAppUser` instance and sanitizes it.
   */
  constructor(name: string, bio?: string | null, image?: string | null, links?: PubkyAppUserLink[] | null, status?: string | null);
  get_data(): any;
}
/**
 * Represents a user's single link with a title and URL.
 */
export class PubkyAppUserLink {
  free(): void;
  /**
   * Creates a new `PubkyAppUserLink` instance and sanitizes it.
   */
  constructor(title: string, url: string);
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_pubkyappuser_free: (a: number, b: number) => void;
  readonly __wbg_pubkyappuserlink_free: (a: number, b: number) => void;
  readonly pubkyappuser_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly pubkyappuser_get_data: (a: number) => [number, number, number];
  readonly pubkyappuserlink_new: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_createresult_free: (a: number, b: number) => void;
  readonly createresult_id: (a: number) => [number, number];
  readonly createresult_path: (a: number) => [number, number];
  readonly createresult_url: (a: number) => [number, number];
  readonly createresult_json: (a: number) => any;
  readonly __wbg_pubkyappspecs_free: (a: number, b: number) => void;
  readonly pubkyappspecs_new: (a: number, b: number) => number;
  readonly pubkyappspecs_createFollow: (a: number, b: number, c: number) => [number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
