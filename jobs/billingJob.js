/*
==========================================
I MART Marketplace
Monthly Billing Job
Version: 1.0
==========================================
*/

const cron = require("node-cron");
const Seller = require("../models/Seller");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {

    try {

        console.log("🔄 Running Monthly Billing Job...");

        const sellers = await Seller.find();

        const today = new Date();

        for (const seller of sellers) {

            if (!seller.nextBillingDate) continue;

            if (today >= seller.nextBillingDate) {

                seller.status = "Suspended";

                seller.billingStatus = "Unpaid";

                const nextDate = new Date(today);
                nextDate.setMonth(nextDate.getMonth() + 1);

                seller.nextBillingDate = nextDate;

                await seller.save();

                console.log(`Seller ${seller.shopName} marked as unpaid.`);

            }

        }

    } catch (error) {

        console.error("❌ Billing Job Error:", error.message);

    }

});

module.exports = {};