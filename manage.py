#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    SMARTCHART = '''
         _____       ___  ___       ___   _____    _____   _____   _   _       ___   _____    _____
        /  ___/     /   |/   |     /   | |  _  \  |_   _| /  ___| | | | |     /   | |  _  \  |_   _|
        | |___     / /|   /| |    / /| | | |_| |    | |   | |     | |_| |    / /| | | |_| |    | |
        \___  \   / / |__/ | |   / / | | |  _  /    | |   | |     |  _  |   / / | | |  _  /    | |
         ___| |  / /       | |  / /  | | | | \ \    | |   | |___  | | | |  / /  | | | | \ \    | |
        /_____/ /_/        |_| /_/   |_| |_|  \_\   |_|   \_____| |_| |_| /_/   |_| |_|  \_\   |_|
        www.smartchart.cn   version: 5.2
    '''
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartcharts.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    print(SMARTCHART)
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
