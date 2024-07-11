import Transaction from "../transaction/transaction.model.js";
import { logger } from "../../helpers/logger.js";

export const getUsage = async (account) => {
  try {
    logger.info("Starting get usage for account");
    const [ transactionsCount] =
      await Promise.all([
        Transaction.countDocuments({ accountId: account._id }),
      ]);
    const totalUsage = transactionsCount;
    return {
      account,
      totalUsage,
    };
  } catch (error) {
    logger.error("Get usage controller error of type: ", error.name);
  }
};
