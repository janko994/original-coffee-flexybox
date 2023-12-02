import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additional">Additional page</Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}
const order = new shopify.rest.Order({session: session});
order.line_items = [
  {
    "title": "Big Brown Bear Boots",
    "price": 74.99,
    "grams": "1300",
    "quantity": 3,
    "tax_lines": [
      {
        "price": 13.5,
        "rate": 0.06,
        "title": "State tax"
      }
    ]
  }
];
order.transactions = [
  {
    "kind": "sale",
    "status": "success",
    "amount": 238.47
  }
];
order.total_tax = 13.5;
order.currency = "EUR";
await order.save({
  update: true,
});

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
