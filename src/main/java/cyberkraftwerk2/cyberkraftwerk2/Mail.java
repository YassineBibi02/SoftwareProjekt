package cyberkraftwerk2.cyberkraftwerk2;

import java.io.File;
import java.io.FileWriter;
import java.util.*;

public class Mail {

    private static String MAILPATH = "actualpath";
    private static String TIPPATH = "actualpath";

    /*save a new mail*/
    public boolean new_mail(String text, int level){
        /*format link*/
        if(!text.contains("LINK")){
            return false;
            }
        else{
            text.replace("LINK", TIPPATH);
            }
        /*scan list.txt for last line*/    
        String lastline = "";
        try{
            
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            while(listscan.hasNextLine()){
                lastline = listscan.nextLine();
                }
            listscan.close();
            }
        catch(Exception e){
            return false;
            }
        /*get id of new template*/
        String lastid = lastline.substring(lastline.indexOf("[ID:") + 4, lastline.indexOf("]"));
        int newid = Integer.parseInt(lastid) + 1;
        /*log new template to list.txt*/
        String newlistline = "\n[ID:" + newid + "][Level:" + level + "]";
        try{
            FileWriter listwriter = new FileWriter(MAILPATH + "list.txt", true);
            listwriter.write(newlistline);
            listwriter.close();
            }
        catch(Exception e){
            return false;
            }
        String newmailpath = MAILPATH + String.valueOf(newid) + ".txt";
        /*save new template*/
        try{
            FileWriter mailwriter = new FileWriter(newmailpath);
            mailwriter.write(text);
            mailwriter.close();
            }
        catch(Exception e){
            return false;
            }
        return true;
    }

    
    public void save_mail(String text, int level, int mail_id){

    }

    
    public String get_mail(int mail_id){
        return null;
    }

    public int get_level(int mail_id){
        return 0;
    }
    
    
    public void send_mails(User[] recipients, String start_date, String end_date){
           
    }




}
