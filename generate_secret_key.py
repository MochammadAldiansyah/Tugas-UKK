#!/usr/bin/env python
"""
Generate a secure Django SECRET_KEY for production
"""

from django.core.management.utils import get_random_secret_key

if __name__ == "__main__":
    secret_key = get_random_secret_key()
    print("Generated SECRET_KEY:")
    print(secret_key)
    print("\nPaste this into your Vercel environment variables!")
