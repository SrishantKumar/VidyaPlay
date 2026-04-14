/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/child-setup` | `/(auth)/login` | `/(auth)/signup` | `/(auth)/splash` | `/(child)` | `/(child)/games` | `/(child)/games/` | `/(child)/games/math-jump` | `/(child)/games/result` | `/(child)/games/word-race` | `/(child)/home` | `/(child)/profile` | `/(child)/rewards` | `/(parent)` | `/(parent)/dashboard` | `/(parent)/pin` | `/_sitemap` | `/child-setup` | `/dashboard` | `/games` | `/games/` | `/games/math-jump` | `/games/result` | `/games/word-race` | `/home` | `/login` | `/pin` | `/profile` | `/rewards` | `/signup` | `/splash`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
