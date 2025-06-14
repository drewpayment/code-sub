# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `bun install`, start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Environment Variables

This project uses PocketBase for the contact form submissions. You will need to create a `.env` file in the root of the project and add the following variables:

```
PB_URL="http://127.0.0.1:8090"
PB_EMAIL="your-pocketbase-admin-email@example.com"
PB_PASSWORD="your-pocketbase-admin-password"
```

Make sure your PocketBase instance is running and you have created a collection named `contact_submissions` with the required schema. You can run `bun run pb:migration` to automatically create the proper migration file, then start/restart PocketBase to apply it.
