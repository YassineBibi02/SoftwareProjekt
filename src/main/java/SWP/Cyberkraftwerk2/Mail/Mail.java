package SWP.Cyberkraftwerk2.Mail;


import SWP.Cyberkraftwerk2.Module.User;
import SWP.Cyberkraftwerk2.Module.UserService;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.FileWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * Class to handle the data and logic for sending mails
 * @author BM
 */
@Repository
public class Mail {

    //path to mail directory
    private static String MAILPATH = "src\\main\\resources\\mails\\"; 
    //path for hyperlink to tip page
    private static String TIPPATH = "http:/23.88.113.199:3000/hereingefallen";

    private UserService userservice;

    @Autowired
    public Mail(UserService userService) {
        this.userservice = userService;
    }

    // autowired EmailService instance to establish the injecting of the mail provider details
    @Autowired
    private EmailService service;
    // static EmailService instance to be used with the static functions
    private static EmailService static_service;

    /**
     * Initializer to register the established EmailService instance as a static instance.
     * @author Tristan Slodowski
     */
    // the Mail class needs an autowired instance of EmailService to properly work. @Autowired can't be used with static fields though, so this workaround is needed to work anyway.
    @PostConstruct
    private void init() {
        this.static_service = service;
    }

    /**
     * internal method, wraps the call to EmailService for timed sending, attempts HTML first, then falls back to plain text
     * @param mailtext the text of the mail
     * @param subject the subject of the mail
     * @param recipient_email the email of the recipient
     * @return void
    */
    private static void actual_sendmail(String mailtext, String subject, String recipient_email){
        try{
            static_service.sendHtmlMessage(recipient_email, subject, mailtext);
            }
        catch(Exception e){
            static_service.sendEmail(recipient_email, subject, mailtext);
            }
    }


    /** 
     * internal instance of TimerTask to send mails
    */
    private static class ActualSendmail extends TimerTask {
            public String MailText = "";
            public String RecipientEmail = "";
            public String Subject = "";

            public ActualSendmail(String mailtext, String recipient_email, String subject) {
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
     * internal instance of TimerTask to unlock the mail service
    */
    private static class UnlockService extends TimerTask {
        public void run()
            {
                unlock_service();
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
    public boolean new_mail(String text, String subject, int level) {
        /*check for valid level*/
        if(level < 1 || level > 3) {
            return false;
            }
        /*make a copy of text*/
        String text_copy = text;
        /*format link*/
        if(!text_copy.contains("LINK")) {
            return false;
            }
        /*scan list.txt for last line*/    
        String lastline = "";
        try{
            
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            while(listscan.hasNextLine()) {
                lastline = listscan.nextLine();
                }
            listscan.close();
            }
        catch(Exception e) {
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
        catch(Exception e) {
            return false;
            }
        /*log new template to subjects.txt*/
        newlistline = "\n[ID:" + newid + ",Subject:'" + subject + "']";
        try{
            FileWriter subjectswriter = new FileWriter(MAILPATH + "subjects.txt", true);
            subjectswriter.write(newlistline);
            subjectswriter.close();
            }
        catch(Exception e) {
            return false;
            }     
        /*save new template*/    
        String newmailpath = MAILPATH + String.valueOf(newid) + ".txt";    
        try{
            FileWriter mailwriter = new FileWriter(newmailpath);
            mailwriter.write(text_copy);
            mailwriter.close();
            }
        catch(Exception e) {
            return false;
            }
        this.userservice.new_mail();
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
    public boolean save_mail(String text, int level, String subject, int mail_id) {
        String text_copy = text;
        boolean valid_id = false;
        /*check for valid level*/
        if(level < 1 || level > 3) {
            return false;
            }
        /*check for LINK and format*/
        if(!text_copy.contains("LINK")) {
            return false;
            }
        /*count lines in list*/
        int total_lines = 0;
        try{    
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            while(listscan.hasNextLine()) {
                listscan.nextLine();
                total_lines++;    
                }
            listscan.close();
            }
        catch(Exception e) {
            return false;
            }
        String newlistline = "[ID:" + String.valueOf(mail_id) + ",Level:" + String.valueOf(level) + "]";
        /*replace line in list.txt*/
        try{
            /*get contents of list.txt*/
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            String[] lines = new String[total_lines];
            for(int i = 0; i < total_lines; i++) {
                lines[i] = listscan.nextLine();
                if(lines[i].contains("ID:" + String.valueOf(mail_id))) {
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
            for(int i = 1; i < total_lines; i++) {
                listwriter_append.write("\n" + lines[i]);
                }
            listwriter_append.close();
            }
        catch(Exception e) {
            return false;
            }
        /*count lines in subjects.txt*/
        total_lines = 0;
        try{    
            File subjects = new File(MAILPATH + "subjects.txt");
            Scanner subjectsscan = new Scanner(subjects);
            while(subjectsscan.hasNextLine()) {
                subjectsscan.nextLine();
                total_lines++;    
                }
            subjectsscan.close();
            }
        catch(Exception e) {
            return false;
            }
        String newsubjectsline = "[ID:" + String.valueOf(mail_id) + ",Subject:'" + subject + "']";
        /*replace line in subjects.txt*/
        try{
            /*get contents of subjects.txt*/
            File subjects = new File(MAILPATH + "subjects.txt");
            Scanner subjectsscan = new Scanner(subjects);
            String[] lines = new String[total_lines];
            for(int i = 0; i < total_lines; i++) {
                lines[i] = subjectsscan.nextLine();
                if(lines[i].contains("ID:" + String.valueOf(mail_id))) {
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
            for(int i = 1; i < total_lines; i++) {
                subjectswriter_append.write("\n" + lines[i]);
                }
            subjectswriter_append.close();
            }
        catch(Exception e) {
            return false;
            }
        /*save new text*/
        try{
            FileWriter mailwriter = new FileWriter(MAILPATH + String.valueOf(mail_id) + ".txt");
            mailwriter.write(text_copy);
            mailwriter.close();
            }
        catch(Exception e) {
            return false;
            }
        return valid_id;
    }


    /**
     * gets the text of the mail specified with mail_id
     * @param  mail_id  the mail
     * @return the mail text
    */
    public String get_mail(int mail_id) {
        /*count lines*/
        int total_lines = 0;
        try{ 
            File list = new File(MAILPATH + String.valueOf(mail_id) + ".txt");
            Scanner mailscan = new Scanner(list);
            while(mailscan.hasNextLine()) {
                mailscan.nextLine();
                total_lines++;    
                }
            mailscan.close();
            }
        catch(Exception e) {
            return null;
            }
        /*get contents of mail*/
        String[] maillines = new String[total_lines];
        try{
            File mail = new File(MAILPATH + String.valueOf(mail_id) + ".txt");
            Scanner mailreader = new Scanner(mail);
            for(int i = 0; i < total_lines; i++) {
                maillines[i] = mailreader.nextLine();
                }
            mailreader.close();
            }
        catch(Exception e) {
            return null;
            }
        /*merge to mail*/
        String mailtext = maillines[0];
        for(int i = 1; i < total_lines; i++) {
            mailtext = mailtext + "\n" + maillines[i];
            }
        return mailtext;
    }


    /**
     *returns all mails in the database
     * @return the mails as an array of String arrays containing mail_id, level, subject, mailtext
    */
    public String[][] get_all() {
        int mailcount = count_mails();
        String[][] mails = new String[mailcount][4];
        for(int i = 1; i <= mailcount; i++) {
            mails[i-1][0] = String.valueOf(i);
            mails[i-1][1] = String.valueOf(get_level(i));
            mails[i-1][2] = get_subject(i);
            mails[i-1][3] = get_mail(i);
            }
        return mails;
    }


    /**
     * gets the level of the mail specified with mail_id
     * @param  mail_id  the mail
     * @return level of the mail
    */
    public int get_level(int mail_id) {
        String line = "";
        try{
            
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            while(listscan.hasNextLine()) {
                line = listscan.nextLine();
                if(line.contains("ID:" + String.valueOf(mail_id))) {
                    break;
                    }
                }
            listscan.close();
            }
        catch(Exception e) {
            return 0;
            }
        if(!line.contains("ID:" + String.valueOf(mail_id))) {
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
    public String get_subject(int mail_id) {
        String line = "";
        try{
            
            File subjects = new File(MAILPATH + "subjects.txt");
            Scanner subjectsscan = new Scanner(subjects);
            while(subjectsscan.hasNextLine()) {
                line = subjectsscan.nextLine();
                if(line.contains("ID:" + String.valueOf(mail_id))) {
                    break;
                    }
                }
            subjectsscan.close();
            }
        catch(Exception e) {
            return null;
            }
        if(!line.contains("ID:" + String.valueOf(mail_id))) {
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
    public static int count_mails() {
        String lastline = "";
        try{
            
            File list = new File(MAILPATH + "list.txt");
            Scanner listscan = new Scanner(list);
            while(listscan.hasNextLine()) {
                lastline = listscan.nextLine();
                }
            listscan.close();
            }
        catch(Exception e) {
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
    private String format_mail(User recipient, String mailtext, int mailid) {
        /*get 2 random User that are not the recipient*/
        User random1 = recipient;
        while(random1.get_ID() == recipient.get_ID()) {
            random1 = userservice.getRandomUser();
            }
        User random2 = recipient;
        while(random2.get_ID() == recipient.get_ID() || random2.get_ID() == random1.get_ID()) {
            random2 = userservice.getRandomUser();
            }
        String formatted_mail = mailtext;
        formatted_mail = formatted_mail.replace("EMPFAENGERVORNAME", recipient.get_firstname());
        formatted_mail = formatted_mail.replace("EMPFAENGERNACHNAME", recipient.get_lastname());
        formatted_mail = formatted_mail.replace("EMPFAENGEREMAIL", recipient.get_email());
        formatted_mail = formatted_mail.replace("KOLLEGE1VORNAME", random1.get_firstname());
        formatted_mail = formatted_mail.replace("KOLLEGE1NACHNAME", random1.get_lastname());
        formatted_mail = formatted_mail.replace("KOLLEGE1EMAIL", random1.get_email());
        formatted_mail = formatted_mail.replace("KOLLEGE2VORNAME", random2.get_firstname());
        formatted_mail = formatted_mail.replace("KOLLEGE2NACHNAME", random2.get_lastname());
        formatted_mail = formatted_mail.replace("KOLLEGE2EMAIL", random2.get_email());
        formatted_mail = formatted_mail.replace("COMPANY", "Kraftwerk Kraft-Wärme-Kopplung GmbH");
        /*format Link */
        format_mail = format_mail.replace("LINK", "<a href=" + '"' + TIPPATH + "?UID=" + String.valueOf(recipient.get_ID()) + "&MID=" + String.valueOf(mailid) + '"' + ">Link</a>");
        return formatted_mail;
    }


    /**
     * internal method, calculates the days between start_date and end_date
     * @param  start_date  the start date as int array with year, month, day in that order
     * @param  end_date  the end date as int array with year, month, day in that order
     * @return array of dates between start_date and end_date, one date per day
     */
    private Date[] get_days(int[] start_date, int[] end_date) {
        if(start_date.length != 3 || end_date.length != 3) {
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
        catch(Exception e) {
            return null;
            }
        /*calculate difference in days between startdate and enddate */
        long difference = enddate.getTime() - startdate.getTime();
        long differencedays = difference / (24 * 60 * 60 * 1000);
        if (differencedays < 0) {
            Date[] datesfallback = new Date[1];
            calendar.setTime(startdate);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            datesfallback[0] = calendar.getTime();
            return datesfallback;
            }
        Date[] dates = new Date[(int)differencedays + 1];
        //dates[0] = startdate;
        for(int i = 0; i < dates.length; i++) {
            /*get startdate + i days*/
            calendar.setTime(startdate);
            calendar.add(Calendar.DATE, i);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            dates[i] = calendar.getTime();
            }
        return dates;
    }


    /**
     * locks the mail service until all mails are sent
     * @return void
    */
    private void lock_service() {
        //writes a 1 in file lock.txt
        try{
            FileWriter lockwriter = new FileWriter(MAILPATH + "lock.txt");
            lockwriter.write("1");
            lockwriter.close();
            }
        catch(Exception e) {
            return;
            }
    }


    /**
     * checks if the mail service is locked
     * @return true if locked, false if not
    */
    private boolean is_locked() {
        //checks if lock.txt contains a 1
        try{
            File lock = new File(MAILPATH + "lock.txt");
            Scanner lockscan = new Scanner(lock);
            String line = lockscan.nextLine();
            lockscan.close();
            if(line.equals("1")) {
                return true;
                }
            else{
                return false;
                }
            }
        catch(Exception e) {
            return false;
            }
    }


    /**
     * unlocks the mail service
     * @return void
    */
    private static void unlock_service() {
        //writes a 0 in file lock.txt
        try{
            FileWriter lockwriter = new FileWriter(MAILPATH + "lock.txt");
            lockwriter.write("0");
            lockwriter.close();
            }
        catch(Exception e) {
            return;
            }
    }


    /**
     * takes an array of users and sends each of them one mail per day from start date to end date
     * @param recipients the recipients
     * @param start_date to keep it easy, length 3 int array with year, month, day in that order
     * @param end_date to keep it easy, length 3 int array with year, month, day in that order
     * @return true if succesfull, false if mails are still being sent
    */
    public boolean send_mails(int[] recipients, int[] start_date, int[] end_date) {
        if (is_locked()) {
            return false;
            }
        else{
            lock_service();
            }
        /*get days*/
        Date[] dates = get_days(start_date, end_date);
        /*timed send*/
        Timer sendtimer = new Timer();
        Calendar calendar = Calendar.getInstance();
        boolean[] first_iteration = new boolean[recipients.length];
        for(int i = 0; i < recipients.length; i++) {
            first_iteration[i] = true;
            }
        int mailssent_lastday = 0;
        /*for each date*/
        for(int d = 0; d < dates.length; d++) {
            int mailssent = 0;
            /*for each user*/
            for(int i = 0; i < recipients.length; i++) {
                User thisuser = userservice.getUserByID(recipients[i]);
                int userlevel = thisuser.get_maillevel();
                int[] possiblemails = new int[count_mails() + 1];
                while(userlevel <= 3) {
                    boolean mailfound = false;
                    /*get mails that match the userlevel*/
                    for (int j = 0; j < possiblemails.length; j++) {
                        possiblemails[j] = 0;
                        }
                    for(int j = 1; j <= count_mails(); j++) {
                        int maillevel = get_level(j);
                        if(maillevel == userlevel) {
                            possiblemails[j] = 1;
                            }
                        }
                    /*compare with mails user has already received*/
                    int[] mailsreceived = thisuser.get_mailsreceived();
                    for(int j = 1; j < mailsreceived.length; j++) {
                        if(mailsreceived[j] == 1) {
                            possiblemails[j] = 0;
                            }
                        }
                    /*send first matching mail*/
                    for(int j = 1; j < possiblemails.length; j++) {
                        if(possiblemails[j] == 1) {
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
                    if(first_iteration[i] == true && !mailfound) {
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
            if (d + 1 == dates.length) {
                mailssent_lastday = mailssent;
                }
            }
        calendar.setTime(dates[dates.length - 1]);
        calendar.set(Calendar.MINUTE, mailssent_lastday + 1);
        Date senddate = calendar.getTime();  
        sendtimer.schedule(new UnlockService(), senddate);
        return true;
    }


    /**
     * only for testing
    */
    public static void main(String[] args) throws Exception {
    }


}
