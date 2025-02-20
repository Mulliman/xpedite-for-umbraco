namespace Xpedite.Backend.Codebase;

public class FileExistsException : Exception
{
    public FileExistsException() : base("File already exists. Do you want to overwrite the existing file?")
    {
    }
}
