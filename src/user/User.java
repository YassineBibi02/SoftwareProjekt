public class User {

    public String Firstname;

    public String Lastname;

    public String EMail;

    public int ID;

    public int[] MailsReceived;

    public int MailLevel;

    public int UserCount;

    /*loads the User with "ID" from Database */
    public User load_user(int ID){
        User loaduser = new User();

        /*load from database*/

        return loaduser;
    }
    
    /*loads all Users from Database*/
    public User[] load_all(){
        User[] Users = User[UserCount];
        for(i = 1; i <= UserCount; i++){
            Users[i] = this.load_user(i);
        }
        return Users;
    }

    /*add new User to database, id set automatically, raise UserCount for all Users*/
    public void add_user(String firstname, String lastname, String email){
        int defaultuser = 0;
        int newID = this.load_user(defaultuser).ID++;
        int[] receivedmails = null;
        int newmaillevel = 1;
        int UserCount = newID;

        /*save user to database*/

        /*update UserCount for all Users in Database*/

    }
}
