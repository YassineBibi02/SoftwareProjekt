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

    /*save a mail that has been edited*/
    public boolean save_mail(String text, int level, int mail_id){
        String line = "";
        int total_lines = 0;
        /*count lines*/
        try{    
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            while(listscan.hasNextLine()){
                line = listscan.nextLine();
                total_lines++;    
                }
            listscan.close();
            }
        catch(Exception e){
            return false;
            }
        String newlistline = "[ID:" + String.valueOf(mail_id) + "][Level:" + String.valueOf(level) + "]";
        /*replace line in list.txt*/
        try{
            /*get contents of list.txt*/
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            String[] lines = new String[total_lines];
            for(int i = 0; i < total_lines; i++){
                lines[i] = listscan.nextLine();
                if(lines[i].contains("ID:" + String.valueOf(mail_id))){
                    lines[i] = newlistline;
                    }
                }
            listscan.close();
            /*write new list.txt*/
            FileWriter listwriter = new FileWriter(MAILPATH + "list.txt");
            listwriter.write(lines[0]);
            listwriter.close();
            FileWriter listwriter_append = new FileWriter(MAILPATH + "list.txt", true);
            for(int i = 1; i < total_lines; i++){
                listwriter_append.write("\n" + lines[i]);
                }
            listwriter_append.close();
            }
        catch(Exception e){
            return false;
            }
        /*save new text*/
        try{
            FileWriter mailwriter = new FileWriter(MAILPATH + String.valueOf(mail_id) + ".txt");
            mailwriter.write(text);
            }
        catch(Exception e){
            return false;
            }
        return true;
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
