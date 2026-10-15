# Generates the adire (resist-dyed indigo) tile as adire.svg. src/assets/adire.jpg was made by
# rendering it at 720x720 in a browser and saving a JPEG. Run: python3 tools/adire-pattern.py
import random, math
random.seed(11)
W=H=720
CREAM="#efe7d2"
out=[]
def wob(v,a=2.2): return v+random.uniform(-a,a)
def ring(cx,cy,r,rings,op,sw):
    for i in range(rings):
        rr=r*(1-i*0.24)+random.uniform(-1.5,1.5)
        if rr<3: break
        # slightly irregular ellipse
        rx=rr*random.uniform(.94,1.06); ry=rr*random.uniform(.94,1.06)
        dash=""
        if random.random()<.35: dash=f' stroke-dasharray="{random.uniform(2,5):.1f} {random.uniform(2,4):.1f}"'
        out.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="none" stroke="{CREAM}" stroke-opacity="{op*random.uniform(.7,1.1):.2f}" stroke-width="{sw*random.uniform(.8,1.3):.1f}"{dash}/>')
    out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{random.uniform(2,4):.1f}" fill="{CREAM}" fill-opacity="{op:.2f}"/>')
def star(cx,cy,r,n,op):
    for k in range(n):
        a=2*math.pi*k/n+random.uniform(-.06,.06)
        r1=r*random.uniform(.35,.5); r2=r*random.uniform(.85,1.05)
        out.append(f'<line x1="{cx+math.cos(a)*r1:.1f}" y1="{cy+math.sin(a)*r1:.1f}" x2="{cx+math.cos(a)*r2:.1f}" y2="{cy+math.sin(a)*r2:.1f}" stroke="{CREAM}" stroke-opacity="{op:.2f}" stroke-width="{random.uniform(3.4,5):.1f}" stroke-linecap="round"/>')
    out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r*.22:.1f}" fill="none" stroke="{CREAM}" stroke-opacity="{op:.2f}" stroke-width="2.4"/>')
def stitch(x,y,length,vertical,op):
    # alabere stitched lines: rows of short dashes with a wobble
    n=int(length/9)
    for k in range(n):
        o=k*9+random.uniform(-.8,.8)
        l=random.uniform(4,7)
        if vertical: out.append(f'<line x1="{wob(x,.8):.1f}" y1="{y+o:.1f}" x2="{wob(x,.8):.1f}" y2="{y+o+l:.1f}" stroke="{CREAM}" stroke-opacity="{op:.2f}" stroke-width="3.6" stroke-linecap="round"/>')
        else: out.append(f'<line x1="{x+o:.1f}" y1="{wob(y,.8):.1f}" x2="{x+o+l:.1f}" y2="{wob(y,.8):.1f}" stroke="{CREAM}" stroke-opacity="{op:.2f}" stroke-width="3.6" stroke-linecap="round"/>')
def dots(cx,cy,n,spread,op):
    for _ in range(n):
        out.append(f'<circle cx="{cx+random.gauss(0,spread):.1f}" cy="{cy+random.gauss(0,spread):.1f}" r="{random.uniform(2.4,4.6):.1f}" fill="{CREAM}" fill-opacity="{op*random.uniform(.6,1):.2f}"/>')
# jittered grid of motifs
cells=5; cs=W/cells
motifs=[]
for gy in range(cells):
    for gx in range(cells):
        cx=gx*cs+cs/2+random.uniform(-cs*.16,cs*.16)
        cy=gy*cs+cs/2+random.uniform(-cs*.16,cs*.16)
        t=random.choice(["ring","ring","ring","star","dots","ring2"])
        r=random.uniform(cs*.2,cs*.34)
        motifs.append((t,cx,cy,r))
for t,cx,cy,r in motifs:
    for dx in (-W,0,W):
        for dy in (-H,0,H):
            x,y=cx+dx,cy+dy
            if x<-r-20 or x>W+r+20 or y<-r-20 or y>H+r+20: continue
            op=random.uniform(.22,.34) if False else None
for t,cx,cy,r in motifs:
    op=random.uniform(.5,.72)
    seed=random.random()
    st=random.getstate()
    for dx in (-W,0,W):
        for dy in (-H,0,H):
            x,y=cx+dx,cy+dy
            if x<-r-20 or x>W+r+20 or y<-r-20 or y>H+r+20: continue
            random.setstate(st)
            if t=="ring": ring(x,y,r,random.choice([3,4,5]),op,5)
            elif t=="ring2": ring(x,y,r*.7,2,op,5.5); dots(x,y,14,r*.9,op*.8)
            elif t=="star": star(x,y,r,random.choice([10,12,14]),op)
            else: dots(x,y,26,r*.7,op)
    random.setstate(st); [random.random() for _ in range(40)]
body="\n".join(out)
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
<filter id="mottle" x="0" y="0" width="100%" height="100%">
 <feTurbulence type="fractalNoise" baseFrequency="0.014 0.02" numOctaves="4" seed="4" stitchTiles="stitch" result="n"/>
 <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.10  0 0 0 0 0.30  0 0 0 1.2 -0.45"/>
</filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
 <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" stitchTiles="stitch" result="g"/>
 <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 -0.38"/>
</filter>
<filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
 <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="2" stitchTiles="stitch" result="w"/>
 <feDisplacementMap in="SourceGraphic" in2="w" scale="7" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="resist" x="0" y="0" width="100%" height="100%">
 <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="2" seed="5" stitchTiles="stitch" result="t"/>
 <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3.2 -0.25" result="m"/>
 <feComposite in="SourceGraphic" in2="m" operator="in"/>
</filter>
</defs>
<rect width="{W}" height="{H}" fill="#14307a"/>
<rect width="{W}" height="{H}" filter="url(#mottle)" opacity=".55"/>
<g filter="url(#wobble)"><g filter="url(#resist)">{body}</g></g>
<rect width="{W}" height="{H}" filter="url(#grain)" opacity=".16"/>
</svg>'''
open("adire.svg","w").write(svg)
