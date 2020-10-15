Each line has 2 points: start and end
circle has center x,y point and radius x,y point
arc has 2 points: start and end


continuous line consists of many line segments that could be lines or arcs

Select:
line
segment
arc
circle


  endPoint.x = arc.x + arc.radius * Math.cos(arc.endAngle);
        endPoint.y = arc.y + arc.radius * Math.sin(arc.endAngle);


calculate distance between 2 points to get circle endpoint insteas of abs of endpoint.x - startpoint.x
