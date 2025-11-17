export default function timeAgo(dateString: string, serverTimeString: string): string {
    const createdAt = new Date(dateString); //created_at
    const serverTime = new Date(serverTimeString); //server now
    
    const localNow = new Date(); //local now
    
    // difference between server time and local time (different timezones, wrong local time set, etc)
    const offset = serverTime.getTime() - localNow.getTime();

    // time passed since created_at and now with offset applied
    const diff = (localNow.getTime() + offset) - createdAt.getTime();   //ms
    
    const diffSeconds = Math.floor(diff / 1000);
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const diffYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

    if(diffSeconds < 60) {
        return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;
    }
    else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffMonths < 12) {
        return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    } else {
        return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
    }
}