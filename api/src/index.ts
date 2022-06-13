import express from "express";
import morgan from "morgan";
import fetch from "node-fetch";

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("common"));

app.get("/", (req, res) => {
  res.end("BAGELS!!");
});

app.post("/slash/menu", async (req, res) => {
  const gqlRes = await fetch(
    "https://ws-api.toasttab.com/consumer-app-bff/v1/graphql",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "apollographql-client-name": "takeout-web",
        "apollographql-client-version": "843",
        "content-type": "application/json",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "toast-customer-access": "",
        "toast-restaurant-external-id": "7fb7d7c2-7204-4fbe-ae03-ce2324ecab68",
        Referer: "https://www.toasttab.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: '[{"operationName":"MENUS","variables":{"input":{"shortUrl":"balsam-bagels","dateTime":"2022-06-11T12:45:00.000Z","restaurantGuid":"7fb7d7c2-7204-4fbe-ae03-ce2324ecab68","menuApi":"DO"}},"query":"query MENUS($input: MenusInput!) {\\n  menusV3(input: $input) {\\n    ... on MenusResponse {\\n      menus {\\n        id\\n        name\\n        groups {\\n          guid\\n          name\\n          description\\n          items {\\n            description\\n            guid\\n            name\\n            outOfStock\\n            price\\n            imageUrl\\n            calories\\n            itemGroupGuid\\n            unitOfMeasure\\n            usesFractionalQuantity\\n            masterId\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on GeneralError {\\n      code\\n      message\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
      method: "POST",
    }
  );
  res.json(await gqlRes.json());
});

app.listen(PORT, "0.0.0.0", () => console.log("listening on " + PORT));
