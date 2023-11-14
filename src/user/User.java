public class User {

    public String Firstname;

    public String Lastname;

    public String EMail;

    public int ID;

    public String MailsReceived;

    public int MailLevel;

    /*loads the User with "ID" from Database */
    public User load_user(int ID){
        return null;
    }
    
    /*loads all Users from Database*/
    public User[] load_all(){
        return null;
    }

    /*add new User to database, id set automatically*/
    public void add_user(String firstname, String lastname, String email){

    }
}
