package SWP.Cyberkraftwerk2.Mail;


import java.io.File;
import java.io.FileWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


import SWP.Cyberkraftwerk2.User.*;


/**
 * Class to handle the data and logic for sending mails
 * @author BM
 */
@Repository
public class Mail {

    private static String MAILPATH = "src\\main\\resources\\mails\\"; // relativer Datenpfad zum mails-Verzeichnis
    private static String TIPPATH = "actualpath";

    private UserService userservice;

    @Autowired
    public Mail(UserService userService){
        this.userservice = userService;
    }


    /**
    * internal method, wraps the call to EmailService for timed sending, attempts HTML first, then falls back to plain text
    * @param mailtext the text of the mail
    * @param subject the subject of the mail
    * @param recipient_email the email of the recipient
    * @return void
    */
    private static void actual_sendmail(String mailtext, String subject, String recipient_email){
        EmailService service = new EmailService();
        try{
            service.sendHtmlMessage(recipient_email, subject, mailtext);
            }
        catch(Exception e){
            service.sendEmail(recipient_email, subject, mailtext);
            }
    }


    /** internal instance of TimerTask to send mails
    */
    private static class ActualSendmail extends TimerTask{
            public String MailText = "";
            public String RecipientEmail = "";
            public String Subject = "";

            public ActualSendmail(String mailtext, String recipient_email, String subject){
                MailText = mailtext;
                RecipientEmail = recipient_email;
                Subject = subject;
                }
            public void run()
                {
                    actual_sendmail(MailText, Subject, RecipientEmail);
                }
    }


    /**
    * saves a new mail
    * Mail MUST at least contain placeholder "LINK" to be valid
    * @param text the new text
    * @param level the new level
    * @param subject the new subject
    * @return true if successful, false if not
    */
    public boolean new_mail(String text, String subject, int level){
        /*check for valid level*/
        if(level < 1 || level > 3){
            return false;
            }
        /*make a copy of text*/
        String text_copy = text;
        /*format link*/
        if(!text_copy.contains("LINK")){
            return false;
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
        String lastid = lastline.substring(lastline.indexOf("[ID:") + 4, lastline.indexOf(","));
        int newid = Integer.parseInt(lastid) + 1;
        /*log new template to list.txt*/
        String newlistline = "\n[ID:" + newid + ",Level:" + level + "]";
        try{
            FileWriter listwriter = new FileWriter(MAILPATH + "list.txt", true);
            listwriter.write(newlistline);
            listwriter.close();
            }
        catch(Exception e){
            return false;
            }
        /*log new template to subjects.txt*/
        newlistline = "\n[ID:" + newid + ",Subject:'" + subject + "']";
        try{
            FileWriter subjectswriter = new FileWriter(MAILPATH + "subjects.txt", true);
            subjectswriter.write(newlistline);
            subjectswriter.close();
            }
        catch(Exception e){
            return false;
            }     
        /*save new template*/    
        String newmailpath = MAILPATH + String.valueOf(newid) + ".txt";    
        try{
            FileWriter mailwriter = new FileWriter(newmailpath);
            mailwriter.write(text_copy);
            mailwriter.close();
            }
        catch(Exception e){
            return false;
            }
        return true;
    }


    /**
    * saves a mail to overwrite an existing mail, e.g. to change the text
    * Mail MUST at least contain placeholder "LINK" to be valid
    * @param text the new text
    * @param level the new level
    * @param mail_id the mail to overwrite
    * @return true if successful, false if not
    */
    public boolean save_mail(String text, int level, String subject, int mail_id){
        String text_copy = text;
        boolean valid_id = false;
        /*check for valid level*/
        if(level < 1 || level > 3){
            return false;
            }
        /*check for LINK and format*/
        if(!text_copy.contains("LINK")){
            return false;
            }
        /*count lines in list*/
        int total_lines = 0;
        try{    
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            while(listscan.hasNextLine()){
                listscan.nextLine();
                total_lines++;    
                }
            listscan.close();
            }
        catch(Exception e){
            return false;
            }
        String newlistline = "[ID:" + String.valueOf(mail_id) + ",Level:" + String.valueOf(level) + "]";
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
                    valid_id = true;
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
        /*count lines in subjects.txt*/
        total_lines = 0;
        try{    
            File subjects = new File(MAILPATH + "subjcts.txt");
            Scanner subjectsscan = new Scanner(subjects);
            while(subjectsscan.hasNextLine()){
                subjectsscan.nextLine();
                total_lines++;    
                }
            subjectsscan.close();
            }
        catch(Exception e){
            return false;
            }
        String newsubjectsline = "[ID:" + String.valueOf(mail_id) + ",Subject:'" + subject + "']";
        /*replace line in subjects.txt*/
        try{
            /*get contents of subjects.txt*/
            File subjects = new File(MAILPATH + "subjects.txt");
            Scanner subjectsscan = new Scanner(subjects);
            String[] lines = new String[total_lines];
            for(int i = 0; i < total_lines; i++){
                lines[i] = subjectsscan.nextLine();
                if(lines[i].contains("ID:" + String.valueOf(mail_id))){
                    lines[i] = newsubjectsline;
                    valid_id = true;
                    }
                }
            subjectsscan.close();
            /*write new subjects.txt*/
            FileWriter subjectswriter = new FileWriter(MAILPATH + "subjects.txt");
            subjectswriter.write(lines[0]);
            subjectswriter.close();
            FileWriter subjectswriter_append = new FileWriter(MAILPATH + "subjects.txt", true);
            for(int i = 1; i < total_lines; i++){
                subjectswriter_append.write("\n" + lines[i]);
                }
            subjectswriter_append.close();
            }
        catch(Exception e){
            return false;
            }
        /*save new text*/
        try{
            FileWriter mailwriter = new FileWriter(MAILPATH + String.valueOf(mail_id) + ".txt");
            mailwriter.write(text_copy);
            mailwriter.close();
            }
        catch(Exception e){
            return false;
            }
        return valid_id;
    }


    /**
    * gets the text of the mail specified with mail_id
    * @param  mail_id  the mail
    * @return the mail text
    */
    public String get_mail(int mail_id){
        /*count lines*/
        int total_lines = 0;
        try{ 
            File list = new File(MAILPATH + String.valueOf(mail_id) + ".txt");
            Scanner mailscan = new Scanner(list);
            while(mailscan.hasNextLine()){
                mailscan.nextLine();
                total_lines++;    
                }
            mailscan.close();
            }
        catch(Exception e){
            return null;
            }
        /*get contents of mail*/
        String[] maillines = new String[total_lines];
        try{
            File mail = new File(MAILPATH + String.valueOf(mail_id) + ".txt");
            Scanner mailreader = new Scanner(mail);
            for(int i = 0; i < total_lines; i++){
                maillines[i] = mailreader.nextLine();
                }
            mailreader.close();
            }
        catch(Exception e){
            return null;
            }
        /*merge to mail*/
        String mailtext = maillines[0];
        for(int i = 1; i < total_lines; i++){
            mailtext = mailtext + "\n" + maillines[i];
            }
        return mailtext;
    }


    /**
    * gets the level of the mail specified with mail_id
    * @param  mail_id  the mail
    * @return level of the mail
    */
    public int get_level(int mail_id){
        String line = "";
        try{
            
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            while(listscan.hasNextLine()){
                line = listscan.nextLine();
                if(line.contains("ID:" + String.valueOf(mail_id))){
                    break;
                    }
                }
            listscan.close();
            }
        catch(Exception e){
            return 0;
            }
        if(!line.contains("ID:" + String.valueOf(mail_id))){
            return 0;
            } 
        String level = line.substring(line.indexOf("Level:") + 6, line.length() - 1);
        return Integer.parseInt(level);
    }

    /**
     * gets the subject of the mail specified with mail_id
     * @param  mail_id  the mail
     * @return subject of the mail
     */
    public String get_subject(int mail_id){
        String line = "";
        try{
            
            File subjects = new File(MAILPATH + "subjects.txt");
            Scanner subjectsscan = new Scanner(subjects);
            while(subjectsscan.hasNextLine()){
                line = subjectsscan.nextLine();
                if(line.contains("ID:" + String.valueOf(mail_id))){
                    break;
                    }
                }
            subjectsscan.close();
            }
        catch(Exception e){
            return null;
            }
        if(!line.contains("ID:" + String.valueOf(mail_id))){
            return null;
            } 
        /*get only the part in line in parentheses */
        String Subject = line.substring(line.indexOf("'") + 1, line.length() - 2);
        return Subject;
    }
    

    /**
    * counts the mails in the database
    * @return number of mails in database
    */
    public int count_mails(){
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
            return -1;
            }
        /*get id*/
        String lastid = lastline.substring(lastline.indexOf("[ID:") + 4, lastline.indexOf(","));
        int count = Integer.parseInt(lastid);
        return count;
    }


    /**
    * internal method, formats the mail text by replacing variables with actual values
    * @param recipient the recipient of the mail
    * @param mailtext the text of the mail
    * @return the formatted mail text
    */
    private String format_mail(User recipient, String mailtext, int mailid){
        String formatted_mail = mailtext;
        formatted_mail = formatted_mail.replace("EMPFAENGERVORNAME", recipient.get_firstname());
        formatted_mail = formatted_mail.replace("EMPFAENGERNACHNAME", recipient.get_lastname());
        /*format Link */
        mailtext = mailtext.replace("LINK", TIPPATH + "?UID=" + String.valueOf(recipient.get_ID()) + "&MID=" + String.valueOf(mailid));
        return formatted_mail;
    }


    /**
     * internal method, calculates the days between start_date and end_date
     * @param  start_date  the start date as int array with year, month, day in that order
     * @param  end_date  the end date as int array with year, month, day in that order
     * @return array of dates between start_date and end_date, one date per day
     */
    private Date[] get_days(int[] start_date, int[] end_date){
        if(start_date.length != 3 || end_date.length != 3){
            return null;
            }
        DateFormat formatdate = new SimpleDateFormat("yyyy/MM/dd");
        Date startdate;
        Date enddate;
        Calendar calendar = Calendar.getInstance();
        try{
            startdate = formatdate.parse(String.valueOf(start_date[0]) + "/" + String.valueOf(start_date[1]) + "/" + String.valueOf(start_date[2]));
            enddate = formatdate.parse(String.valueOf(end_date[0]) + "/" + String.valueOf(end_date[1]) + "/" + String.valueOf(end_date[2]));
            }
        catch(Exception e){
            return null;
            }
        /*calculate difference in days between startdate and enddate */
        long difference = enddate.getTime() - startdate.getTime();
        long differencedays = difference / (24 * 60 * 60 * 1000);
        Date[] dates = new Date[(int)differencedays + 1];
        dates[0] = startdate;
        for(int i = 0; i < dates.length; i++){
            /*get startdate + 1 day*/
            calendar.setTime(startdate);
            calendar.add(Calendar.DATE, i);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            dates[i] = calendar.getTime();
            }
        return dates;
    }

    /**
    * takes an array of users and sends each of them one mail per day from start date to end date
    * @param recipients the recipients
    * @param start_date to keep it easy, length 3 int array with year, month, day in that order
    * @param end_date to keep it easy, length 3 int array with year, month, day in that order
    * @return void
    */
    public void send_mails(int[] recipients, int[] start_date, int[] end_date){
        /*get days*/
        Date[] dates = get_days(start_date, end_date);
        /*timed send*/
        Timer sendtimer = new Timer();
        Calendar calendar = Calendar.getInstance();
        boolean[] first_iteration = new boolean[recipients.length];
        for(int i = 0; i < recipients.length; i++){
            first_iteration[i] = true;
            }
        /*for each date*/
        for(int d = 0; d < dates.length; d++){
            int mailssent = 0;
            /*for each user*/
            for(int i = 0; i < recipients.length; i++){
                User thisuser = userservice.getUserByID(recipients[i]);
                int userlevel = thisuser.get_maillevel();
                int[] possiblemails = new int[count_mails() + 1];
                while(userlevel <= 3) {
                    boolean mailfound = false;
                    /*get mails that match the userlevel*/
                    for (int j = 0; j < possiblemails.length; j++){
                        possiblemails[j] = 0;
                        }
                    for(int j = 1; j <= count_mails(); j++){
                        int maillevel = get_level(j);
                        if(maillevel == userlevel){
                            possiblemails[j] = 1;
                            }
                        }
                    /*compare with mails user has already received*/
                    int[] mailsreceived = thisuser.get_mailsreceived();
                    for(int j = 1; j < mailsreceived.length; j++){
                        if(mailsreceived[j] == 1){
                            possiblemails[j] = 0;
                            }
                        }
                    /*send first matching mail*/
                    for(int j = 1; j < possiblemails.length; j++){
                        if(possiblemails[j] == 1){
                            String mailtext = get_mail(j);
                            mailtext = format_mail(thisuser, mailtext, j);
                            String subject = get_subject(j);
                            calendar.setTime(dates[d]);
                            calendar.set(Calendar.MINUTE, mailssent);
                            Date senddate = calendar.getTime();
                            sendtimer.schedule(new ActualSendmail(mailtext, thisuser.get_email(), subject), senddate);
                            /*log mail as received, gets reset when user clicks link*/
                            userservice.mail_received(thisuser.get_ID(), j);
                            mailssent++;
                            mailfound = true;
                            break;
                            }
                        }
                    if(first_iteration[i] == true && !mailfound){
                        /*raise userlevel, but only if no received mails this cycle to ensure integrity*/
                        first_iteration[i] = false;
                        userservice.raise_userlevel(thisuser.get_ID());
                        userlevel++;
                        }
                    else{
                        first_iteration[i] = false;
                        break;
                        }
                    }
                    
                }
            }    
    }


    public static void main(String[] args) throws Exception {
    }


}
