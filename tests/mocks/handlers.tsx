import { rest } from "msw";

export const handler = rest.get("*/react-query", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      name: "mocked-react-query",
    })
  );
});


export const entryListHandler = rest.get("*/entry-list", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      name: "mocked-entry-list",
    })
  );
}
);

export const handlers = [handler, entryListHandler];