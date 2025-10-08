source $MAGICCUBE_HOME/venv/bin/activate
pip install smartchart -U
python $MAGICCUBE_HOME/manage.py collectstatic
python $MAGICCUBE_HOME/manage.py makemigrations
python $MAGICCUBE_HOME/manage.py migrate
uwsgi --reload $MAGICCUBE_HOME/uwsgi.pid