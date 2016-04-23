from pythreejs import *
import numpy as np
from IPython.display import display
from ipywidgets import HTML, Text
from traitlets import link, dlink
nx, ny = (20, 20)
xmax=1
x = np.linspace(-xmax, xmax, nx)
y = np.linspace(-xmax, xmax, ny)
xx, yy = np.meshgrid(x, y)
z = xx ** 2 - yy ** 2
#z[6,1] = float('nan')
surf_g = SurfaceGeometry(z=list(z[::-1].flat), 
                         width=2 * xmax,
                         height=2 * xmax,
                         width_segments=nx - 1,
                         height_segments=ny - 1)

surf = Mesh(geometry=surf_g, material=LambertMaterial(map=height_texture(z[::-1], 'YlGnBu_r')))
surfgrid = SurfaceGrid(geometry=surf_g, material=LineBasicMaterial(color='black'))
hover_point = Mesh(geometry=SphereGeometry(radius=0.05), material=LambertMaterial(color='hotpink'))
scene = Scene(children=[surf, surfgrid, hover_point, AmbientLight(color='#777777')])
c = PerspectiveCamera(position=[0, 3, 3], up=[0, 0, 1], 
                      children=[DirectionalLight(color='white', position=[3, 5, 1], intensity=0.6)])
click_picker = Picker(root=surf, event='dblclick')
hover_picker = Picker(root=surf, event='mousemove')
renderer = Renderer(camera=c, scene = scene, controls=[OrbitControls(controlling=c), click_picker, hover_picker])

def f(change):
    value = change['new']
    print('Clicked on %s' % value)
    point = Mesh(geometry=SphereGeometry(radius=0.05), 
                 material=LambertMaterial(color='red'),
                 position=value)
    scene.children = list(scene.children) + [point]

click_picker.observe(f, names=['point'])

link((hover_point, 'position'), (hover_picker, 'point'))

h = HTML()
def g(change):
    h.value = 'Pink point at (%.3f, %.3f, %.3f)' % tuple(change['new'])
g({'new': hover_point.position})
hover_picker.observe(g, names=['point'])
display(h)
# display(renderer)
