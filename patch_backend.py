from pathlib import Path

base = Path(r'c:\Users\OH JAH\Desktop\I MART')

# Patch payment.js verify route
p = base / 'routes' / 'payment.js'
text = p.read_text(encoding='utf-8')
text = text.replace('router.get(\n    "/verify",\n    userAuth,\n    verifyPayment\n);', 'router.get(\n    "/verify",\n    verifyPayment\n);')
p.write_text(text, encoding='utf-8')

# Patch cartController.js quantity handling
p = base / 'controllers' / 'cartController.js'
text = p.read_text(encoding='utf-8')
text = text.replace('                    product: productId,\n                    quantity: quantity || 1', '                    product: productId,\n                    quantity: qty')
p.write_text(text, encoding='utf-8')

print('patch_backend.py applied')
