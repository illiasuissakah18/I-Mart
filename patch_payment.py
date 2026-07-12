from pathlib import Path

path = Path('controllers/paymentController.js')
text = path.read_text(encoding='utf-8')
start = text.index('exports.verifyPayment = async (req, res) => {')
brace = 0
end = None
for j, ch in enumerate(text[start:]):
    if ch == '{':
        brace += 1
    elif ch == '}':
        brace -= 1
        if brace == 0:
            end = start + j + 1
            break
if end is None:
    raise SystemExit('Could not find function end')

new = '''exports.verifyPayment = async (req, res) => {
    try {
        verifyPaystackSignature(req);

        const event = req.body.event;
        const paymentData = req.body.data;

        if (!paymentData || !paymentData.metadata) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook payload."
            });
        }

        if (event !== "charge.success") {
            return res.status(200).json({
                success: true,
                message: "Event ignored."
            });
        }

        const orderId = paymentData.metadata.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
            console.error("Verify Payment Error: order not found", orderId);
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.paymentStatus === "Paid") {
            return res.status(200).json({
                success: true,
                message: "Order already paid",
                order
            });
        }

        order.paymentStatus = "Paid";
        order.status = "Processing";
        order.paymentReference = paymentData.reference;

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order
        });

    } catch (error) {
        console.error("Verify Payment Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};\n'''

path.write_text(text[:start] + new + text[end:], encoding='utf-8')
print('Payment controller patched')
