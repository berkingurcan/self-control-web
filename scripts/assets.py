"""Rebuild checked-in favicons, PWA icons and social cards. Local-only dependency: Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import re, xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1];static=root/'static'
colors={'academy':'#FFFFFF','muaythai':'#B7D19C','kickbox':'#AAC6E6','mma':'#E0A097'}
labels={'academy':'FIGHT ACADEMY','muaythai':'MUAY THAI','kickbox':'KİCK BOKS','mma':'MMA'}
ET.register_namespace('', 'http://www.w3.org/2000/svg')
logo = ET.parse(static/'brand/mark.svg').getroot()
polys=[]
for el in logo:
 vals=[float(v) for v in re.findall(r'[\d.]+',el.attrib['points'])];polys.append(list(zip(vals[::2],vals[1::2])))
def mark(draw,box,color):
 x,y,w,h=box
 for poly in polys:draw.polygon([(x+(a-300)*w/400,y+(b-355)*h/290) for a,b in poly],fill=color)
for id,color in colors.items():
 out=static/'icons'/id;out.mkdir(parents=True,exist_ok=True)
 favicon = ET.Element(logo.tag, {'viewBox': '300 300 400 400', 'fill': '#000000' if id == 'academy' else color})
 if id != 'academy':
  ET.SubElement(favicon, '{http://www.w3.org/2000/svg}rect', {
   'x': '300', 'y': '300', 'width': '400', 'height': '400', 'rx': '76', 'fill': '#080808'
  })
 favicon.extend(logo)
 (out/'favicon.svg').write_text(ET.tostring(favicon, encoding='unicode') + '\n', encoding='utf-8')
 for name,size in [('icon-192',192),('icon-512',512),('maskable-512',512),('apple-touch-icon',180)]:
  k=3;im=Image.new('RGB',(size*k,size*k),'#080808');d=ImageDraw.Draw(im)
  mark(d,(size*k*.2,size*k*.28,size*k*.6,size*k*.435),color)
  im.resize((size,size),Image.Resampling.LANCZOS).save(out/(name+'.png'))
 social=Image.new('RGB',(1200,630),'#080808');d=ImageDraw.Draw(social)
 d.rectangle((32,32,1168,598),outline='#444444',width=1)
 mark(d,(770,175,310,225),color)
 font=ImageFont.truetype(str(static/'fonts/BarlowCondensed-ExtraBold.ttf'),110)
 small=ImageFont.truetype(str(static/'fonts/BarlowCondensed-ExtraBold.ttf'),40)
 d.text((70,115),'SELF',font=font,fill=color);d.text((70,220),'CONTROL.',font=font,fill=color)
 d.text((75,410),labels[id],font=small,fill='#FFFFFF')
 (static/'social').mkdir(exist_ok=True);social.save(static/'social'/(id+'.jpg'),quality=92)
print('Generated original-emblem favicons, PWA icons and social cards for all four identities.')
