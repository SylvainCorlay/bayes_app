from IPython.display import display
from ipywidgets import jslink,  IntSlider

from ipyleaflet import Map

m = Map(center=[34.6252978589571, -77.34580993652344])
zoom_slider = IntSlider(description='Zoom', min=3, max=17, value=10)
jslink((zoom_slider, 'value'), (m, 'zoom'))
display(m)
