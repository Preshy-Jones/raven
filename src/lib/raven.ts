import axios from "axios";
import config from "../config";

export class RavenBankService {
  private readonly baseUrl = "https://integrations.getravenbank.com/v1/";
  private readonly apiKey: string;

  // constructor(apiKey: string) {
  //   this.apiKey = apiKey;
  // }

  client: any;

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${config.raven.apiKey}`,
      },
    });
  }

  async generateCollectionAccount(
    userId: string,
    email: string,
    firstName: string,
    lastName: string
  ) {
    const response = await this.client.post(
      `${this.baseUrl}/v1/pwbt/generate_account`,
      {
        userId,
        email,
        firstName,
        lastName,
      }
    );
    return response.data;
  }

  async initiateTransfer(
    bankCode: string,
    accountNumber: string,
    amount: number,
    reference: string
  ) {
    const response = await this.client.post(`${this.baseUrl}/transfers`, {
      bankCode,
      accountNumber,
      amount,
      reference,
      narration: "Transfer from Money Transfer App",
    });
    return response.data;
  }
}
