#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    try:
        from smart_chart.echart import get_version
    except Exception as e:
        print('you need pip install smartchart')
        return
    SMARTCHART = f'''======powered by smartchart   version: {get_version()}====='''
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'magiccube.settings')
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
