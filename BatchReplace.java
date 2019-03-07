//设计了一种批量进行模板替换的方法，性能是直接进行replace的三倍

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
/**
 * Created by hinotohui on 18/5/21.
 */

public class BatchReplace {
   private static class ReplaceInfo{
      public String from;
      public String to;
      public int length;
      public int offset;

      public ReplaceInfo(String from,String to,
        int length,int offset){
            this.from=from;
            this.to=to;
            this.length=length;
            this.offset=offset;
      }
   }

   private static ReplaceInfo next(String source,
        ReplaceInfo[] ris,int start,boolean global){

            int match_failure=0;
            int last=0x7fff;
            int point=0;

            if(global==true){
               for (int i=0;i<ris.length;i++){
                  int offset=source.indexOf(ris[i].from,start);
                  if(offset==-1){
                     match_failure++;
                     ris[i].offset=0x7fff;
                  }else{
                     ris[i].offset=offset;
                     if(offset<last){
                        last=offset;
                        point=i;
                     }
                  }
               }
            }else{
                for (int i=0;i<ris.length;i++){
                   ReplaceInfo ri=ris[i];
                   if(ri.offset==0x7fff)
                      match_failure++;
                   else{
                      if(ri.offset<last){
                        last=ri.offset;
                        point=i;
                       }
                   }
                }
             }
            if(match_failure==ris.length)
                return null;
            else
                return ris[point];
      }

      public static String batchreplace(String source,
          HashMap<String,String> regrexes) throws Exception{
            int start=0;

            ReplaceInfo[] ris=new ReplaceInfo[regrexes.size()];

            Set<Map.Entry<String,String>> entrysets=regrexes.entrySet();
            int index=0;

            for(Map.Entry<String,String> entry:entrysets){
               String from=entry.getKey();
               String to=entry.getValue();
               ris[index]=new ReplaceInfo(from,to,from.length(),0);
               index++;
            }

            if(index!=ris.length)
               throw new Exception();

            StringBuffer sb=new StringBuffer();

            boolean global=true;

            while(true){
               ReplaceInfo ri=next(source,ris,start,global);
               if(ri==null){
                  if(start>0){
                    sb.append(source.substring(start));
                    source=sb.toString();
                  }
                  break;
               }else{

                    sb.append(source.substring(start, ri.offset))
                      .append(ri.to);

                    start=ri.offset+ri.length;
                    int offset=source.indexOf(ri.from,start);

                    if(offset==-1){
                       ri.offset=0x7fff;
                    }else{
                       ri.offset=offset;
                    }
                    global=false;
               }
           }
           return source;
      }

    public static void main(String[] args) throws Exception {        // TODO Auto-generated method stub
        String s="123${r}${d}123${resultid}${d}${resultid}";

        HashMap<String,String> map=new HashMap<String,String> ();

        map.put("${r}", "r");
        map.put("${d}", "d");
        map.put("${resultid}", "resultid");
        map.put("${result}", "resultid");

        String sd=null;

        long s1=System.currentTimeMillis();
        for(int i=0;i<1000;i++){
            sd=batchreplace(s,map);
            /*sd=s.replace("${r}","r")
              .replace("${d}", "d")
              .replace("${resultid}", "resultid")
              .replace("${result}", "resultid");
             */
        }

        long e1=System.currentTimeMillis();
        System.out.println(e1-s1);
        System.out.println(sd);
    }
}


