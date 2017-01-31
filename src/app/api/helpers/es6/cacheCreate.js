import Cache from 'ttl-cache';

export default (ttl = 120, interval = 60) => new Cache({ttl, interval});