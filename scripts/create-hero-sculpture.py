"""Original transparent 3D geometry for the layered type composition."""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np
import math

out=Path(__file__).resolve().parents[1]/'public/images/hero-sculpture.png'
U,V=384,112
u=np.arange(U)*2*np.pi/U
v=np.arange(V)*2*np.pi/V
uu,vv=np.meshgrid(u,v,indexing='ij')
minor=.66+.06*np.cos(uu*3)
base=np.stack([(2+minor*np.cos(vv))*np.cos(uu),(2+minor*np.cos(vv))*np.sin(uu),minor*np.sin(vv)+.17*np.sin(uu*2)],axis=-1)
normal=np.stack([np.cos(vv)*np.cos(uu),np.cos(vv)*np.sin(uu),np.sin(vv)],axis=-1)
ax,ay,az=.88,-.34,-.40
rx=np.array([[1,0,0],[0,math.cos(ax),-math.sin(ax)],[0,math.sin(ax),math.cos(ax)]])
ry=np.array([[math.cos(ay),0,math.sin(ay)],[0,1,0],[-math.sin(ay),0,math.cos(ay)]])
rz=np.array([[math.cos(az),-math.sin(az),0],[math.sin(az),math.cos(az),0],[0,0,1]])
rot=rz@ry@rx
pts=base.reshape(-1,3)@rot.T
n=normal.reshape(-1,3)@rot.T
reflection=2*n[:,2,None]*n-np.array([0,0,1])
band=np.exp(-((reflection[:,1]+.15)/.17)**2)
side=np.exp(-((reflection[:,0]-.6)/.22)**2)
diffuse=np.clip(n@np.array([-.5,-.6,.8]),0,1)
colour=np.array([49,25,98])+diffuse[:,None]*np.array([50,25,80])+band[:,None]*np.array([145,153,154])+side[:,None]*np.array([64,68,112])
colour=np.clip(colour,0,255).astype(np.uint8)
width,height=2100,1900
perspective=8/(8-pts[:,2])
projected=np.stack([width*.5+pts[:,0]*perspective*286,height*.5-pts[:,1]*perspective*286],axis=1)
indices=np.arange(U*V).reshape(U,V)
quads=np.stack([indices,np.roll(indices,-1,0),np.roll(np.roll(indices,-1,0),-1,1),np.roll(indices,-1,1)],axis=-1).reshape(-1,4)
depth=pts[quads,2].mean(axis=1)
image=Image.new('RGBA',(width,height),(0,0,0,0))
draw=ImageDraw.Draw(image)
for index in np.argsort(depth):
 q=quads[index]
 c=tuple(colour[q].mean(axis=0).astype(np.uint8))+(255,)
 draw.polygon([tuple(point) for point in projected[q]],fill=c)
image.save(out,optimize=True)
print('Created transparent violet sculpture:',out.name)
