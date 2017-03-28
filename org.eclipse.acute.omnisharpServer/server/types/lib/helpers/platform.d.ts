export declare enum SupportedPlatform {
    None = 0,
    Windows = 1,
    OSX = 2,
    CentOS = 3,
    Debian = 4,
    Fedora = 5,
    OpenSUSE = 6,
    RHEL = 7,
    Ubuntu14 = 8,
    Ubuntu16 = 9,
}
export declare function getSupportedPlatform(platform?: string): SupportedPlatform;
export declare const supportedPlatform: SupportedPlatform;
