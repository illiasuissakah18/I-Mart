/*
==========================================
I MART Marketplace
Automatic Seller Billing Checker
==========================================
*/

const cron = require("node-cron");
const Seller = require("../models/Seller");

// Runs every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {

    console.log("Checking seller subscriptions...");

    try {

        const today = new Date();

        const sellers = await Seller.find();

        for (const seller of sellers) {

            if (today > seller.nextBillingDate) {

                seller.billingStatus = "Unpaid";

                const suspensionDate = new Date(seller.nextBillingDate);

                suspensionDate.setDate(
                    suspensionDate.getDate() +
                    seller.gracePeriodDays
                );

                if (today >= suspensionDate) {
                    seller.status = "Suspended";
                }

                await seller.save();
            }

        }

        console.log("Seller billing check completed.");

    } catch (err) {

        console.log(err);

    }

});