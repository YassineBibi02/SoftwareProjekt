package SWP.Cyberkraftwerk2.Module;

public class User {

    public String Firstname;

    public String Lastname;

    public String EMail;

    public int ID;

    public int[] MailsReceived;

    public int MailLevel;


    public User(String firstname, String lastname, String email, int id, int[] mailsreceived, int maillevel){
        this.Firstname = firstname;
        this.Lastname = lastname;
        this.EMail = email;
        this.ID = id;
        this.MailsReceived = mailsreceived;
        this.MailLevel = maillevel;
    }

    public int count_users(){
        return 0;
    }

    /*loads the User with "ID" from Database */
    public User load_user(int ID){
        /*load from database*/
        String firstname = "test";
        String lastname = "test";
        String email = "test";
        String mailsreceived_as_string = "test";
        int maillevel = 0;
        /*format received mails*/
        int[] mailsreceived = new int[mailsreceived_as_string.length()];
        for(int i = 0; i < mailsreceived_as_string.length(); i++){
            mailsreceived[i] = Character.getNumericValue(mailsreceived_as_string.charAt(i));
        }
        User loaduser = new User(firstname, lastname, email, ID, mailsreceived, maillevel);
        return loaduser;
    }
    
    /*loads all Users from Database*/
    public User[] load_all(){
        User[] Users = new User[this.count_users()];
        for(int i = 1; i <= this.count_users(); i++){
            Users[i - 1] = this.load_user(i);
        }
        return Users;
    }

    /*add new User to database, id set automatically, raise UserCount for all Users*/
    public void add_user(String firstname, String lastname, String email){
        int newID = this.count_users() + 1;
        String mailsreceived = "0";
        int newmaillevel = 1;

        /*save user to database*/

    }

    public static void mail_received(int ID, int receivedmail, int newmaillevel){
        /*change User in database*/

    }

    public static void change_user(int ID, String firstname, String lastname, String email){
        /*change User "ID" in database*/

    }
}
